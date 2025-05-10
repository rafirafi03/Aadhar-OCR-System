import express from 'express';
import ocrRoutes from './ocrRoutes'

const router = express.Router();

router.use('/aadhar', ocrRoutes);

// Define more routes here as needed
router.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

export default router;