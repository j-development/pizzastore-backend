require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Just nu sparas en kopia av refreshTokens in memory på servern
// Som gör det möjligt att revoka access för användare/inkräktare
// Bör sparas i en redis datastore eller i någon säker databas i framtiden
const refreshTokensStore = [];

const users = [];

async function seedUser(username, password) {
  try {
    const salt = await bcrypt.genSalt();
    const encryptedPW = await bcrypt.hash(password, salt);

    users.push({ username: username, password: encryptedPW });
  } catch (error) {
    console.log(error);
  }
}

seedUser('foo', '123');

async function login(req, res) {
  if (!req.body.username || !req.body.password)
    return res.status(500).json({ message: 'Did not receive credentials' });
  const username = req.body.username;

  const user = users.find((user) => {
    return username === user.username;
  });

  let isValid = false;
  if (user != null) {
    isValid = await bcrypt.compare(req.body.password, user.password);
  }

  if (isValid) {
    const user = { username };
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    refreshTokensStore.push(refreshToken);
    res.json({ access_token: accessToken, refresh_token: refreshToken });
  }
  if (!isValid) {
    console.log('Did not validate');
    res.status(401);
  }
}

function signAccessToken(user) {
  const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, {
    expiresIn: '10m',
  });
  return accessToken;
}

function signRefreshToken(user, clientRefreshToken) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY);
  // Method overloading, om en refresh token skickas med så ska den försvinna från
  // tokenStoren och bytas ut till den nya refreshToken av säkerhetsskäl
  if (clientRefreshToken) {
    let index = refreshTokensStore.indexOf(clientRefreshToken);
    refreshTokensStore.splice(index, 1);
  }
  refreshTokensStore.push(refreshToken);
  return refreshToken;
}

function refreshTokens(req, res) {
  const clientRefreshToken = req.body.refresh_token;

  //Existerar inte refreshToken i tokenStoren så har access blivit återkallad
  //Returnar därmed ett felmeddelande
  if (!clientRefreshToken || !refreshTokensStore.includes(clientRefreshToken))
    return res.sendStatus(401);

  jwt.verify(
    clientRefreshToken,
    process.env.REFRESH_SECRET_KEY,
    (err, decodedJWT) => {
      if (err) return res.sendStatus(403);
      const user = { username: decodedJWT.username };
      const accessToken = signAccessToken(user);
      const refreshToken = signRefreshToken(user, clientRefreshToken);
      return res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    }
  );
}

function verifyToken(req, res) {
  let accessToken = req.headers.authorization.split(' ')[1];
  jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, decodedJWT) => {
    if (err) {
      console.log(err.message);
      return res.status(403).send(err);
    }
    return res.json({ valid: true });
  });
}

// Logga in och få tillbaka access och refresh-token
router.post('/login', login);

// Använd refresh-token för att få tillbaka en ny giltig access-token
router.post('/refresh', refreshTokens);

// Validera en klients accessToken
router.post('/verify', verifyToken);

module.exports = router;
