import { Request, Response } from 'express';
import { analyzeImages } from '../services/imageProcessing'; // Importing the function directly

interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

interface MulterFiles {
  [fieldname: string]: MulterFile[];
}

// Use the function directly in the controller
export const ocrController = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as MulterFiles;

    if (!files || !files.frontImage || !files.backImage) {
      res.status(400).json({
        success: false,
        message: 'Both front and back image files are required'
      });
      return;
    }

    const frontImageBuffer: Buffer = files.frontImage[0].buffer;
    const backImageBuffer: Buffer = files.backImage[0].buffer;

    // Directly call the function `analyzeImages`
    const combinedAnalysis = await analyzeImages(frontImageBuffer, backImageBuffer);

    res.status(200).json({
      success: true,
      data: {
        combined: combinedAnalysis
      }
    });
  } catch (error) {
    console.error('Error processing images:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};
