import {getPool} from '../config/db.js';



export const createSchoolsTable = async () => {
  const pool = getPool();
  const query = `
    CREATE TABLE IF NOT EXISTS schools (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      address VARCHAR(400) NOT NULL,
      latitude FLOAT NOT NULL,
      longitude FLOAT NOT NULL
    )
  `;
  // Log of create qury
  try {
    await pool.execute(query);
    console.log('Schools table ensured in the database.'); 
  } catch (err) {
    console.error('Error creating schools table:', err.message);
    throw err;
  }
};





