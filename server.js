const express = require('express');
const cors = require('cors');
const pizzarouter = require('./routes/pizza');
const authrouter = require('./routes/auth');
const PORT = 3050;

const app = express(); // Skapar en express applikation

app.use(cors());

// Gör att vi kan få ut body-data från put och post-requests,
// samma funktionalitet som body-parser fast vi slipper installera ett extra package.
app.use(express.urlencoded({ extended: true }));

app.use('/pizza', pizzarouter);
app.use('/auth', authrouter);

app.get('/', (req, res) => {
  res.json({ res: 'success' });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
