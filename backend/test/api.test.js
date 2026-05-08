const request = require('supertest');
const app = require('../src/app');

describe('API LenovoStore /api/products', () => {
  let createdProductId;

  it('GET /api/products - debe devolver la lista de laptops', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    // Verificar que al menos uno de los productos sea Lenovo
    const hasLenovo = res.body.some(p => p.brand === 'Lenovo');
    expect(hasLenovo).toBe(true);
  });

  it('POST /api/products - debe crear un nuevo producto con imagen', async () => {
    const newProduct = {
      name: 'Test Laptop',
      brand: 'TestBrand',
      category: 'Laptops',
      description: 'Testing purposes',
      price: 999.99,
      stock: 5,
      image: 'https://test.com/image.png'
    };
    const res = await request(app)
      .post('/api/products')
      .send(newProduct);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.image).toBe(newProduct.image);
    createdProductId = res.body.id;
  });

  it('GET /api/products/:id - debe devolver el producto creado', async () => {
    const res = await request(app).get(`/api/products/${createdProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(createdProductId);
  });

  it('PUT /api/products/:id - debe actualizar el producto', async () => {
    const updateData = {
      name: 'Updated Laptop',
      brand: 'TestBrand',
      category: 'Laptops',
      description: 'Updated testing purposes',
      price: 899.99,
      stock: 3,
      image: 'https://test.com/updated.png'
    };
    const res = await request(app)
      .put(`/api/products/${createdProductId}`)
      .send(updateData);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe(updateData.name);
    expect(res.body.price).toBe(899.99);
  });

  it('DELETE /api/products/:id - debe eliminar el producto', async () => {
    const res = await request(app).delete(`/api/products/${createdProductId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Product deleted');
  });
});
