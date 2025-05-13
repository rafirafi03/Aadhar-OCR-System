"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ocrRoutes_1 = __importDefault(require("./ocrRoutes"));
const router = express_1.default.Router();
router.use('/aadhar', ocrRoutes_1.default);
// Define more routes here as needed
router.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});
exports.default = router;
