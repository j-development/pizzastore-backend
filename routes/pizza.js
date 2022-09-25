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
    id: 1,
    name: 'MARGARITA',
    price: 80,
    pizzagroup: 1,
  },
  {
    id: 2,
    name: 'VESUVIO',
    price: 85,
    pizzagroup: 1,
  },
  {
    id: 3,
    name: 'CAPRICCIOSA',
    price: 90,
    pizzagroup: 2,
  },
  {
    id: 4,
    name: 'SALAMI',
    price: 90,
    pizzagroup: 2,
  },
  {
    id: 5,
    name: 'TOMASO',
    price: 90,
    pizzagroup: 2,
  },
  {
    id: 6,
    name: 'HAWAII',
    price: 90,
    pizzagroup: 2,
  },
  {
    id: 7,
    name: 'CALZONE',
    price: 95,
    pizzagroup: 3,
  },
  {
    id: 8,
    name: 'CALZONE KEBAB',
    price: 100,
    pizzagroup: 3,
  },
  {
    id: 9,
    name: 'MILANO SPECIAL',
    price: 100,
    pizzagroup: 3,
  },
  {
    id: 10,
    name: 'PALERMO',
    price: 100,
    pizzagroup: 4,
  },
  {
    id: 11,
    name: 'BAGAREN SPECIAL',
    price: 100,
    pizzagroup: 4,
  },
  {
    id: 12,
    name: 'KEBABPIZZA',
    price: 100,
    pizzagroup: 5,
  },
  {
    id: 13,
    name: 'HOCKEYPIZZA',
    price: 105,
    pizzagroup: 5,
  },
  {
    id: 14,
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

function deletePizza(req, res) {}

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
