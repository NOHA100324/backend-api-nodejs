const pool = require('../db');
const useDatabase = !!pool;

const fallbackProducts = [
  {
    id: 1,
    name: 'ThinkPad X1 Carbon Gen 11',
    category: 'Laptops',
    brand: 'Lenovo',
    description: 'Ultraportátil premium con procesadores Intel Core de 13ra generación y pantalla OLED de 14".',
    price: 1899.00,
    stock: 15,
    image: 'https://p1-ofp.static.pub/medias/bWFycW9zXzE2Njg0MjgxOTI1OTBfMjk0/lenovo-laptop-thinkpad-x1-carbon-gen-11-14-intel-subseries-gallery-1.png'
  },
  {
    id: 2,
    name: 'ThinkBook 14 Gen 6',
    category: 'Laptops',
    brand: 'Lenovo',
    description: 'Productividad moderna para pequeñas empresas, con seguridad mejorada y diseño elegante.',
    price: 949.00,
    stock: 20,
    image: 'https://p2-ofp.static.pub/medias/25732168395_ThinkBook14G6IRL_202304190412211682390772740.png'
  },
  {
    id: 3,
    name: 'Yoga 9i Gen 8',
    category: '2-in-1',
    brand: 'Lenovo',
    description: 'Versatilidad excepcional con sonido envolvente Bowers & Wilkins y pantalla PureSight OLED.',
    price: 1649.00,
    stock: 8,
    image: 'https://p4-ofp.static.pub/medias/25442978583_Yoga914IRP8_202210131114001666840332822.png'
  },
  {
    id: 4,
    name: 'Legion Pro 7i Gen 8',
    category: 'Gaming',
    brand: 'Lenovo',
    description: 'Dominación total con IA ajustada por Lenovo AI Engine+ y gráficos NVIDIA GeForce RTX serie 40.',
    price: 2499.00,
    stock: 5,
    image: 'https://p1-ofp.static.pub/medias/25555132353_LegionPro716IRX8_202211151025591669966144889.png'
  }
];

async function queryDb(sql, params = []) {
  if (!useDatabase) {
    throw new Error('Database is not configured');
  }
  const [rows] = await pool.query(sql, params);
  return rows;
}

function validateProduct(body) {
  const { name, category, brand, price, stock } = body;
  return Boolean(name && category && brand && price != null && stock != null);
}

async function getAllProducts(req, res) {
  try {
    if (useDatabase) {
      const rows = await queryDb(
        'SELECT id, name, category, brand, description, price, stock, image, discount FROM products'
      );
      return res.json(rows);
    }
    return res.json(fallbackProducts);
  } catch (err) {
    return res.status(500).json({ message: 'Error reading products', error: err.message });
  }
}

async function getProductById(req, res) {
  try {
    const id = Number(req.params.id);
    if (useDatabase) {
      const rows = await queryDb(
        'SELECT id, name, category, brand, description, price, stock, image, discount FROM products WHERE id = ?',
        [id]
      );
      if (!rows.length) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json(rows[0]);
    }

    const product = fallbackProducts.find(item => item.id === id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Error reading product', error: err.message });
  }
}

async function createProduct(req, res) {
  try {
    if (!validateProduct(req.body)) {
      return res.status(400).json({ message: 'All product fields are required' });
    }

    const { name, category, brand, description, price, stock, image, discount } = req.body;
    const imageUrl = req.file ? req.file.path : (image || '');

    if (useDatabase) {
      const result = await queryDb(
        'INSERT INTO products (name, category, brand, description, price, stock, image, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, category, brand, description || '', price, stock, imageUrl, discount || 0]
      );
      const [rows] = await pool.query(
        'SELECT id, name, category, brand, description, price, stock, image, discount FROM products WHERE id = ?',
        [result.insertId]
      );
      return res.status(201).json(rows[0]);
    }

    const newProduct = {
      id: fallbackProducts.length ? Math.max(...fallbackProducts.map(p => p.id)) + 1 : 1,
      name,
      category,
      brand,
      description: description || '',
      price,
      stock,
      image: image || '',
      discount: discount || 0
    };
    fallbackProducts.push(newProduct);
    return res.status(201).json(newProduct);
  } catch (err) {
    return res.status(500).json({ message: 'Error creating product', error: err.message });
  }
}

async function updateProduct(req, res) {
  try {
    if (!validateProduct(req.body)) {
      return res.status(400).json({ message: 'All product fields are required' });
    }

    const id = Number(req.params.id);
    const { name, category, brand, description, price, stock, image, discount } = req.body;
    const imageUrl = req.file ? req.file.path : (image || '');

    if (useDatabase) {
      const result = await queryDb(
        'UPDATE products SET name = ?, category = ?, brand = ?, description = ?, price = ?, stock = ?, image = ?, discount = ? WHERE id = ?',
        [name, category, brand, description || '', price, stock, imageUrl, discount || 0, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const [rows] = await pool.query(
        'SELECT id, name, category, brand, description, price, stock, image, discount FROM products WHERE id = ?',
        [id]
      );
      return res.json(rows[0]);
    }

    const product = fallbackProducts.find(item => item.id === id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    Object.assign(product, { 
      name, category, brand, description: description || '', 
      price, stock, image: image || '', discount: discount || 0 
    });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: 'Error updating product', error: err.message });
  }
}

async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (useDatabase) {
      const result = await queryDb('DELETE FROM products WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      return res.json({ message: 'Product deleted' });
    }

    const index = fallbackProducts.findIndex(item => item.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }
    fallbackProducts.splice(index, 1);
    return res.json({ message: 'Product deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Error deleting product', error: err.message });
  }
}

async function deductStock(req, res) {
  try {
    const id = Number(req.params.id);
    const { qty } = req.body;

    if (useDatabase) {
      const [product] = await pool.query('SELECT stock FROM products WHERE id = ?', [id]);
      if (!product.length) return res.status(404).json({ message: 'Product not found' });
      
      const newStock = product[0].stock - qty;
      if (newStock < 0) return res.status(400).json({ message: 'Insufficient stock' });

      await pool.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, id]);
      return res.json({ message: 'Stock updated', newStock });
    }

    const product = fallbackProducts.find(item => item.id === id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    product.stock -= qty;
    return res.json({ message: 'Stock updated', newStock: product.stock });
  } catch (err) {
    return res.status(500).json({ message: 'Error updating stock', error: err.message });
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deductStock,
};
