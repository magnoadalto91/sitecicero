-- Rodar este script no banco Railway após criar o serviço PostgreSQL

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price DECIMAL(12, 2),
  type VARCHAR(50),
  purpose VARCHAR(50),
  city VARCHAR(100),
  description TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS property_images (
  id SERIAL PRIMARY KEY,
  property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  cloudinary_public_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
