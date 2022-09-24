require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const pizzaGroup = {
  1: 'Pizza grupp 1',
  2: 'Pizza grupp 2',
  3: 'Inbakade pizzor',
  4: 'Halvinbakade pizzor',
  5: 'Kebabpizzor',
};

let pizzaList = [
  {
    name: 'MARGARITA',
    price: 80,
    pizzagroup: 1,
  },
  {
    name: 'VESUVIO',
    price: 85,
    pizzagroup: 1,
  },
  {
    name: 'CAPRICCIOSA',
    price: 90,
    pizzagroup: 2,
  },
  {
    name: 'SALAMI',
    price: 90,
    pizzagroup: 2,
  },
  {
    name: 'TOMASO',
    price: 90,
    pizzagroup: 2,
  },
  {
    name: 'HAWAII',
    price: 90,
    pizzagroup: 2,
  },
  {
    name: 'CALZONE',
    price: 95,
    pizzagroup: 3,
  },
  {
    name: 'CALZONE KEBAB',
    price: 100,
    pizzagroup: 3,
  },
  {
    name: 'MILANO SPECIAL',
    price: 100,
    pizzagroup: 3,
  },
  {
    name: 'PALERMO',
    price: 100,
    pizzagroup: 4,
  },
  {
    name: 'BAGAREN SPECIAL',
    price: 100,
    pizzagroup: 4,
  },
  {
    name: 'KEBABPIZZA',
    price: 100,
    pizzagroup: 5,
  },
  {
    name: 'HOCKEYPIZZA',
    price: 105,
    pizzagroup: 5,
  },
  {
    name: 'FAVORIT',
    price: 100,
    pizzagroup: 5,
  },
];

function getPizzas(req, res) {
  res.send(pizzaList);
}

function createPizza(req, res) {
  let pizza;
  let name = req.body.name;
  let price = req.body.price;
  let pizzagroup = req.body.pizzagroup;

  // Kan vara bra att veta vem som skapat en pizza, ej implementerat ännu
  let username = req.username;

  if ((name, price, pizzagroup)) {
    pizza = {
      name: name.toUpperCase(),
      price: parseInt(price),
      pizzagroup: parseInt(pizzagroup),
    };
    pizzaList.push(pizza);
  }

  res.send(pizza);
}

function verifyToken(req, res, next) {
  let accessToken = req.headers.authorization.split(' ')[1];
  jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, decodedUser) => {
    if (err) {
      console.log(err.message);
      return res.sendStatus(403);
    }
    req.username = decodedUser.username;
    next();
  });
}

router.get('/', getPizzas);
router.post('/', verifyToken, createPizza);

module.exports = router;
