import dotenv from 'dotenv';

import mysql from 'mysql2';
import express from 'express';
import { initializeDatabase, getPool } from './config/db.js';
import { createSchoolsTable } from './models/school_model.js';
import router from './routes/schoolRoute.js';
dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

// Initialize the database connection pool and ensure the table exists
async function init() {
  try {
    await initializeDatabase(); // Initialize the database
    await createSchoolsTable(); // Ensure the schools table exists
    console.log('Database and table initialized successfully.');

    // Start the server only after the database is initialized
    app.listen(PORT, () => {  
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error during initialization:', error.message);
    process.exit(1); // Exit the process if initialization fails
  }
}

init();

app.get('/', (req, res) => {
  res.send('Welcome to the School Locator  API!');
});

app.use('/', router); // Use the school routes

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});



