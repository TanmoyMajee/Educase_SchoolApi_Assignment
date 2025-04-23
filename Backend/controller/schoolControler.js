import {getPool} from '../config/db.js';
import { validateAddSchool } from '../util/schoolValidator.js';

const addSchool = async (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // validate by joi
   validateAddSchool(req.body);

  try {
    const pool = getPool();
    const query = `
      INSERT INTO schools (name, address, latitude, longitude)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await pool.execute(query, [name, address, latitude, longitude]);
    res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
  } catch (error) {
    console.error('Error adding school:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// const getAllSchools = async (req, res) => {
//     // 
// }

// const getSchoolById = async (req, res) => {
//   console.log('Request params:', req.params); // Debugging log

//   // Extract id from path parameters
//   const { id } = req.params;

//   // Check if id exists and is valid
//   if (!id) {
//     return res.status(400).json({ message: 'School id is required' });
//   }

//   const numericId = Number(id); // Convert id to a number
//   if (isNaN(numericId)) {
//     return res.status(400).json({ message: 'School id must be a number' });
//   }

//   try {
//     const pool = getPool();
//     const query = `SELECT * FROM schools WHERE id = ?`;
//     const [rows] = await pool.execute(query, [numericId]);

//     if (rows.length === 0) {
//       return res.status(404).json({ message: 'School not found' });
//     }

//     res.status(200).json(rows[0]);
//   } catch (error) {
//     console.error('Error fetching school:', error.message);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };



const getNearbySchools = async (req, res) => {
      const { latitude, longitude } = req.query;
      // Validate latitude and longitude
      if (!latitude || !longitude) {
        return res.status(400).json({ message: 'Latitude and longitude are required' });
      }
      const lat = parseFloat(latitude);
      const lon = parseFloat(longitude);
      if (isNaN(lat) || isNaN(lon)) {
        return res.status(400).json({ message: 'Invalid latitude or longitude' });
      }
      // chk long and lat are in range
      if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        return res.status(400).json({ message: 'Latitude and longitude must be in range' });
      }
      try {
        const pool = getPool();
        const query = `
            SELECT id, name, address, latitude, longitude,
        (6371 * acos(
         cos(radians(?)) * cos(radians(latitude))
         * cos(radians(longitude) - radians(?))
         + sin(radians(?)) * sin(radians(latitude))
      )) AS distance
    FROM schools
    ORDER BY distance;
        `;
        const [rows] = await pool.execute(query, [lat, lon, lat]);
        res.status(200).json(rows);
      } catch (error) {
        console.error('Error fetching nearby schools:', error.message);
        res.status(500).json({ message: 'Internal server error' });
      }
}

export { addSchool, getNearbySchools };