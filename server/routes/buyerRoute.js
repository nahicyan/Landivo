import express from "express";
import { 
  makeOffer, 
  getOffersByBuyer, 
  getOffersOnProperty, 
  createVipBuyer,
  createBuyer,
  getAllBuyers,
  getBuyerById,
  updateBuyer,
  deleteBuyer
} from "../controllers/buyerCntrl.js";

const router = express.Router();

// Route to create or update an offer
router.post("/makeOffer", makeOffer);

// Route to get offers by property or buyer
router.get("/offers/property/:propertyId", getOffersOnProperty);
router.get("/offers/buyer", getOffersByBuyer);

// Routes to create buyers
router.post("/createVipBuyer", createVipBuyer);
router.post("/create", createBuyer);

// Buyer CRUD operations
router.get("/all", getAllBuyers);
router.get("/:id", getBuyerById);
router.put("/update/:id", updateBuyer);
router.delete("/delete/:id", deleteBuyer);

export { router as buyerRoute };