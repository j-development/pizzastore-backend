require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

function login(req, res) {
  //TODO:*Validera inloggningsuppgifer*
  let isValid = true;

  //Tex, skickar in med authorization headern "foo//123"
  //Då blir username foo och password 123
  const username = req.body.username;
  console.log(username);
  const user = { username };

  if (isValid) {
    const accessToken = signAccessToken(user);
    res.json({ access_token: accessToken });
  }
  if (!isValid) {
    res.status(401);
  }
}

function signAccessToken(user) {
  const accessToken = jwt.sign(user, process.env.ACCESS_SECRET_KEY, {
    expiresIn: '15s',
  });
  return accessToken;
}

// Logga in och få tillbaka access och refresh-token
router.post('/login', login);

// Använd refresh-token för att få tillbaka en ny giltig access-token
router.post('/refresh');

module.exports = router;