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
    name: 'Margarita',
    price: 80,
    pizzagroup: 1,
  },
  {
    name: 'Vesuvio',
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

  res.send(pizza);
}

router.get('/', getPizzas);
router.post('/', createPizza);

module.exports = router;
