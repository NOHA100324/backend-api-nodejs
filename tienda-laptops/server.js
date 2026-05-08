const express = require('express');
const app = express();

app.use(express.json());

const laptopRoutes = require('./routes/laptops');
app.use('/laptops', laptopRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
