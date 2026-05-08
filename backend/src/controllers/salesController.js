let sales = [];

exports.getAllSales = (req, res) => {
  res.json(sales);
};

exports.createSale = (req, res) => {
  const { items, total, type, date } = req.body;
  const newSale = {
    id: sales.length + 1,
    items,
    total,
    type,
    date: date || new Date().toISOString()
  };
  sales.push(newSale);
  res.status(201).json(newSale);
};
