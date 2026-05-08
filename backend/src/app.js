const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');
const employeesRouter = require('./routes/employees');
const salesRouter = require('./routes/sales');
const authRouter = require('./routes/auth');
const app = express();

app.use(cors());
app.use(express.json());
app.get('/', (_req, res) => {
  res.json({ status: 'API running', version: '1.0.0' });
});
app.use('/api/products', productsRouter);
app.use('/api/employees', employeesRouter);
app.use('/api/sales', salesRouter);
app.use('/api/auth', authRouter);

module.exports = app;
