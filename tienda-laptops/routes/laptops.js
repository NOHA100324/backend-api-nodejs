const express = require('express');
const router = express.Router();

const {
  obtenerLaptops,
  obtenerLaptop,
  crearLaptop,
  actualizarLaptop,
  eliminarLaptop
} = require('../controllers/laptopController');

router.get('/', obtenerLaptops);
router.get('/:id', obtenerLaptop);
router.post('/', crearLaptop);
router.put('/:id', actualizarLaptop);
router.delete('/:id', eliminarLaptop);

module.exports = router;
