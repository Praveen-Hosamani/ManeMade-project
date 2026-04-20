-- backend/sql/schema.sql
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    stock_status VARCHAR(50) NOT NULL,
    updates VARCHAR(255),
    image VARCHAR(500),
    weight VARCHAR(50)
);
