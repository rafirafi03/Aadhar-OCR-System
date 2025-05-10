import express from 'express';
import { upload } from '../middlewares/multerConfig';
import { ocrController } from '../controllers/ocrController'


const router = express.Router();

router.post('/parse', upload.fields([
  { name: 'frontImage' },
  { name: 'backImage' }
]), ocrController); // Use processImages (plural) to match your controller

export default router;