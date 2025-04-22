import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool = null;

export async function initializeDatabase() {
  // Connect without a database
  const tmpPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });

  // Create DB if missing
  await tmpPool.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
  );
  await tmpPool.end();

  // Now create real connection pool
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true
  });

  // Test the connection
  try {
  const connection = await pool.getConnection();
  connection.release(); // Return to pool
  console.log('Database connected successfully');
} catch (err) {
  console.error('Database connection failed:', err.message);
  process.exit(1); // Exit app if DB connection fails
}
  
  return pool;
}

export  function getPool() {
  if (!pool) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return pool;
}