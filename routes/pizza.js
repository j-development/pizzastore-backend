require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();

const pizzaGroup = [
  {
    id: 1,
    name: 'Pizza grupp 1',
  },
  {
    id: 2,
    name: 'Pizza grupp 2',
  },
  {
    id: 3,
    name: 'Inbakade pizzor',
  },
  {
    id: 4,
    name: 'Halvinbakade pizzor',
  },
  {
    id: 5,
    name: 'Kebabpizzor',
  },
];

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
function getPizzaGroups(req, res) {
  res.send(pizzaGroup);
}

function deletePizza(req, res) {
  const { id } = req.params;

  const index = pizzaList.findIndex((pizza) => {
    return pizza.id === parseInt(id);
  });

  let pizza = pizzaList.splice(index, 1);

  res.json(pizza);
}

function verifyToken(req, res, next) {
  let accessToken = req.headers.authorization.split(' ')[1];
  jwt.verify(accessToken, process.env.ACCESS_SECRET_KEY, (err, decodedJWT) => {
    if (err) {
      console.log(err.message);
      return res.status(403).send(err);
    }
    req.username = decodedJWT.username;
    next();
  });
}

router.get('/', getPizzas);
router.delete('/:id', deletePizza);
router.get('/groups', getPizzaGroups);
router.post('/', verifyToken, createPizza);

module.exports = router;
