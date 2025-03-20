import express from 'express';
import { 
    createResidency, 
    getAllResidencies, 
    getResidency, 
    updateResidency, 
    getResidencyImages, 
    createResidencyWithMultipleFiles 
} from '../controllers/residencyCntrl.js';
import { upload } from '../config/multerConfig.js';

const router = express.Router();

// 1. Static and specific routes first
router.post("/create", createResidency);
router.post("/createWithFile", upload.array("images", 10), createResidencyWithMultipleFiles);
router.get("/allresd", getAllResidencies);

// 2. Dynamic routes last
router.get("/:id", getResidency);
router.put("/update/:id", upload.array("images", 10), updateResidency);
router.get("/:id/image", getResidencyImages);

export { router as residencyRoute };
