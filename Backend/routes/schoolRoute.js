import express from 'express';
import { addSchool , getNearbySchools } from '../controller/schoolControler.js';
const router = express.Router();

// Route to create a new school
router.post('/addSchool', addSchool);
router.get('/listSchools',getNearbySchools);
// router.get('/getSchoolById/:id', getSchoolById);



export default router;