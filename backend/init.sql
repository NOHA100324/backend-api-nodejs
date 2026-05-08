CREATE DATABASE IF NOT EXISTS rest_api_db;
USE rest_api_db;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  image VARCHAR(500),
  discount INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  position VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  total DECIMAL(10,2) NOT NULL,
  type VARCHAR(50) NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  items JSON
);

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'employee') DEFAULT 'employee'
);

-- Note: In a real app, passwords should be hashed. For this demo init, we'll use a placeholder.
-- The backend will handle hashing for new registrations.
INSERT INTO users (name, email, password, role) VALUES
  ('Admin Lenovo', 'admin@lenovostore.com', '$2a$10$X78zY.B5y9B.O.bU/f.NueLgC7B9B9B9B9B9B9B9B9B9B9B9B9B9B', 'admin');


INSERT INTO products (name, category, brand, description, price, stock, image, discount) VALUES
  ('ThinkPad X1 Carbon Gen 11', 'Laptops', 'Lenovo', 'Ultraportátil premium con procesadores Intel Core de 13ra generación y pantalla OLED de 14".', 1899.00, 15, 'https://p1-ofp.static.pub/medias/bWFycW9zXzE2Njg0MjgxOTI1OTBfMjk0/lenovo-laptop-thinkpad-x1-carbon-gen-11-14-intel-subseries-gallery-1.png', 10),
  ('ThinkBook 14 Gen 6', 'Laptops', 'Lenovo', 'Productividad moderna para pequeñas empresas, con seguridad mejorada y diseño elegante.', 949.00, 20, 'https://p2-ofp.static.pub/medias/25732168395_ThinkBook14G6IRL_202304190412211682390772740.png', 5),
  ('Yoga 9i Gen 8', '2-in-1', 'Lenovo', 'Versatilidad excepcional con sonido envolvente Bowers & Wilkins y pantalla PureSight OLED.', 1649.00, 8, 'https://p4-ofp.static.pub/medias/25442978583_Yoga914IRP8_202210131114001666840332822.png', 15),
  ('Legion Pro 7i Gen 8', 'Gaming', 'Lenovo', 'Dominación total con IA ajustada por Lenovo AI Engine+ y gráficos NVIDIA GeForce RTX serie 40.', 2499.00, 5, 'https://p1-ofp.static.pub/medias/25555132353_LegionPro716IRX8_202211151025591669966144889.png', 0);
