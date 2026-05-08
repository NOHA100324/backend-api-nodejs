const laptops = require('../data/laptops');

exports.obtenerLaptops = (req, res) => {
  res.json(laptops);
};

exports.obtenerLaptop = (req, res) => {
  const laptop = laptops.find(l => l.id == req.params.id);

  if (!laptop) {
    return res.status(404).json({
      mensaje: "Laptop no encontrada"
    });
  }

  res.json(laptop);
};

exports.crearLaptop = (req, res) => {
  const nuevaLaptop = {
    id: laptops.length + 1,
    marca: req.body.marca,
    modelo: req.body.modelo,
    precio: req.body.precio
  };

  laptops.push(nuevaLaptop);
  res.status(201).json(nuevaLaptop);
};

exports.actualizarLaptop = (req, res) => {
  const laptop = laptops.find(l => l.id == req.params.id);

  if (!laptop) {
    return res.status(404).json({
      mensaje: "Laptop no encontrada"
    });
  }

  laptop.marca = req.body.marca;
  laptop.modelo = req.body.modelo;
  laptop.precio = req.body.precio;

  res.json(laptop);
};

exports.eliminarLaptop = (req, res) => {
  const index = laptops.findIndex(l => l.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({
      mensaje: "Laptop eliminada"
    });
  }

  laptops.splice(index, 1);
  res.json({
    mensaje: "Laptop eliminada"
  });
};
