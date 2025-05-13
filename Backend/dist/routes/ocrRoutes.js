"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multerConfig_1 = require("../middlewares/multerConfig");
const ocrController_1 = require("../controllers/ocrController");
const router = express_1.default.Router();
router.post('/parse', multerConfig_1.upload.fields([
    { name: 'frontImage' },
    { name: 'backImage' }
]), ocrController_1.ocrController); // Use processImages (plural) to match your controller
exports.default = router;
