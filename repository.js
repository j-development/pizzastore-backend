const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pizzadb',
  password: 'password',
  port: 5432,
});

// Saved for later use if we needed to seed data to a new DB.
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

module.exports.pool = pool;
