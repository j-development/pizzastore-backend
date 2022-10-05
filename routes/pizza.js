require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const db = require('../repository');

async function getPizzas(req, res) {
  const query = 'SELECT * FROM pizza';
  let dbres;
  try {
    dbres = await db.pool.query(query);
    res.send(dbres.rows);
  } catch (error) {
    console.log(error);
    res.json({ error: true });
  }
}

async function createPizza(req, res) {
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

    const query =
      'INSERT INTO pizza (name, price, pizzagroup_id) VALUES ($1::TEXT, $2::INT, $3::INT)';
    const values = [pizza.name, pizza.price, pizza.pizzagroup];

    let dbres;
    try {
      dbres = await db.pool.query(query, values);
    } catch (error) {
      console.log(error);
    }
  }

  res.send(pizza);
}

async function updatePizza(req, res) {
  let pizza;
  let id = req.body.id;
  let name = req.body.name;
  let price = req.body.price;
  let pizzagroup = req.body.pizzagroup;

  if ((name, price, pizzagroup, id)) {
    pizza = {
      name: name.toUpperCase(),
      id: parseInt(id),
      price: parseInt(price),
      pizzagroup: parseInt(pizzagroup),
    };

    const query = `UPDATE "pizza" 
    SET "name" = $1, "price" = $2, "pizzagroup_id" = $3
    WHERE "id" = $4`;
    const values = [pizza.name, pizza.price, pizza.pizzagroup, pizza.id];

    let dbres;
    try {
      dbres = await db.pool.query(query, values);
    } catch (error) {
      console.log(error);
    }
  }

  res.send(pizza);
}

async function getPizzaGroups(req, res) {
  const query = 'SELECT * FROM pizzagroup';

  try {
    let dbres = await db.pool.query(query);
    res.send(dbres.rows);
  } catch (error) {
    console.log(error);
    res.json({ error: true });
  }
}

async function deletePizza(req, res) {
  const { id } = req.params;

  const query = `DELETE FROM pizza WHERE id=${id}`;
  let dbres;
  try {
    dbres = await db.pool.query(query);
  } catch (error) {
    console.log(error);
  }

  res.json({ success: true, msg: `Pizza deleted with Id: ${id}` });
}

async function createOrder(req, res) {
  if (!req.body.customer_name || !req.body.itemList)
    return res.status(500).json({ message: 'Something went wrong' });

  let customerName = req.body.customer_name;
  let cost = await pizzaTotalCost(req.body.itemList);
  const query =
    'INSERT INTO orders (cost, customer_name) VALUES ($1::INT, $2::TEXT) RETURNING id';
  const values = [cost, customerName];

  let dbres;
  try {
    dbres = await db.pool.query(query, values);
  } catch (error) {
    console.log(error);
  }

  let order_id = dbres.rows[0].id;

  //TODO:Implementation av entries till order_pizza join-tablen
  res.json({ success: true, order_id: order_id });
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

async function pizzaTotalCost(itemList) {
  let totalcost = 0;
  const query = `SELECT id,price FROM pizza`;

  let pizzaCostList;
  try {
    pizzaCostList = await db.pool.query(query);
  } catch (error) {
    console.log(error);
    res.json({ error: true });
  }

  itemList.forEach((item) => {
    let price = pizzaCostList.rows.filter((pizza) => {
      return pizza.id === item.pizza_id;
    })[0].price;
    totalcost += price * item.quantity;
  });

  return totalcost;
}

router.get('/', getPizzas);
router.delete('/:id', deletePizza);
router.get('/groups', getPizzaGroups);
router.post('/', verifyToken, createPizza);
router.put('/', verifyToken, updatePizza);
router.post('/order', createOrder);

module.exports = router;
