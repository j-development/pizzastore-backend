require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

// Just nu sparas en kopia av refreshTokens in memory på servern
// Som gör det möjligt att revoka access för användare/inkräktare
// Bör sparas i en redis datastore eller i någon säker databas i framtiden
const refreshTokensStore = [];

function login(req, res) {
  //TODO:*Validera inloggningsuppgifer*
  let isValid = true;

  const username = req.body.username;
  const user = { username };

  if (isValid) {
    const accessToken = signAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_SECRET_KEY);
    refreshTokensStore.push(refreshToken);
    res.json({ access_token: accessToken, refresh_token: refreshToken });
  }
  if (!isValid) {
    res.status(401);
  }
}

function signAccessToken(user) {
  const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, {
    expiresIn: '10m',
  });
  return accessToken;
}

// Logga in och få tillbaka access och refresh-token
router.post('/login', login);

// Använd refresh-token för att få tillbaka en ny giltig access-token
router.post('/refresh');

module.exports = router;
