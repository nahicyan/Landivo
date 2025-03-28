import asyncHandler from "express-async-handler";
import { prisma } from "../config/prismaConfig.js";
import {
  sendOfferNotification,
  newOfferTemplate,
  updatedOfferTemplate,
  lowOfferTemplate,
} from "../utils/offerNotification.js";

// Function to make an offer
export const makeOffer = asyncHandler(async (req, res) => {
  const {
    email,
    phone,
    buyerType,
    propertyId,
    offeredPrice,
    firstName,
    lastName,
  } = req.body;

  if (!email || !phone || !propertyId || !offeredPrice || !firstName || !lastName) {
    res.status(400).json({
      message: "First Name, Last Name, Email, phone, property ID, and offered price are required.",
    });
    return;
  }

  try {
    // 1. Find or create buyer
    let buyer = await prisma.buyer.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone }],
      },
    });

    if (!buyer) {
      buyer = await prisma.buyer.create({
        data: {
          email: email.toLowerCase(),
          phone,
          buyerType,
          firstName,
          lastName,
          source: "Property Offer",
        },
      });
    }

    // 2. Retrieve property details for notifications
    const property = await prisma.residency.findUnique({
      where: { id: propertyId },
    });

    // 3. Check if the buyer already made an offer on the same property
    const existingOffer = await prisma.offer.findFirst({
      where: {
        buyerId: buyer.id,
        propertyId,
      },
    });

    if (existingOffer) {
      if (parseFloat(offeredPrice) > parseFloat(existingOffer.offeredPrice)) {
        // Update the existing offer with the higher price
        const updatedOffer = await prisma.offer.update({
          where: { id: existingOffer.id },
          data: {
            offeredPrice,
            timestamp: new Date(),
          },
        });

        // Send response first
        res.status(200).json({
          message: "Your previous offer was updated to the new higher price.",
          offer: updatedOffer,
        });

        // Send notification email in the background
        await sendOfferNotification(
          "Offer Updated",
          updatedOfferTemplate(property, buyer, offeredPrice)
        );
        return;
      } else {
        res.status(400).json({
          message: `You have already made an offer of $${existingOffer.offeredPrice}. Offer a higher price to update.`,
          existingOffer,
        });
        return;
      }
    }

    // 4. Create a new offer
    const newOffer = await prisma.offer.create({
      data: {
        propertyId,
        offeredPrice,
        buyerId: buyer.id,
        timestamp: new Date(),
      },
    });

    // 5. Check if the offer is below the minimum price
    if (parseFloat(offeredPrice) < parseFloat(property.minPrice)) {
      // Send response first with a low offer warning
      res.status(201).json({
        message: `Offer submitted successfully, but it is below the minimum price of $${property.minPrice}. Consider offering a higher price.`,
        offer: newOffer,
      });

      // Send low offer notification in the background
      await sendOfferNotification(
        "Low Offer Submitted",
        lowOfferTemplate(property, buyer, offeredPrice)
      );
      return;
    }

    // 6. Send response for successful offer submission
    res.status(201).json({
      message: "Offer created successfully.",
      offer: newOffer,
    });

    // 7. Send new offer notification in the background
    await sendOfferNotification(
      "New Offer Submitted",
      newOfferTemplate(property, buyer, offeredPrice)
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while processing the offer.",
      error: err.message,
    });
  }
});

export const getOffersOnProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  if (!propertyId) {
    res.status(400).json({ message: "Property ID is required." });
    return;
  }

  try {
    // Fetch all offers for the property, including buyer details
    const offers = await prisma.offer.findMany({
      where: { propertyId },
      include: {
        buyer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
      },
      orderBy: {
        timestamp: "desc", // Change to "asc" for oldest first
      },
    });

    res.status(200).json({
      propertyId,
      totalOffers: offers.length,
      offers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while fetching offers for the property.",
      error: err.message,
    });
  }
});

export const getOffersByBuyer = asyncHandler(async (req, res) => {
  const { email, phone } = req.query;

  if (!email && !phone) {
    res
      .status(400)
      .json({ message: "At least one of email or phone is required." });
    return;
  }

  try {
    // Find buyer by email or phone
    const buyer = await prisma.buyer.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (!buyer) {
      res
        .status(404)
        .json({ message: "Buyer not found with the provided email or phone." });
      return;
    }

    // Fetch all offers by the buyer
    const offers = await prisma.offer.findMany({
      where: { buyerId: buyer.id },
      orderBy: {
        timestamp: "desc", // Change to "asc" for oldest first
      },
    });

    res.status(200).json({
      buyer: {
        firstName: buyer.firstName,
        lastName: buyer.lastName,
        email: buyer.email,
        phone: buyer.phone,
      },
      totalOffers: offers.length,
      offers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while fetching offers for the buyer.",
      error: err.message,
    });
  }
});

export const createVipBuyer = asyncHandler(async (req, res) => {
  const { email, phone, buyerType, firstName, lastName, preferredAreas } = req.body;

  // Validate that preferredAreas exists and is an array
  if (!email || !phone || !buyerType || !firstName || !lastName || !preferredAreas || !Array.isArray(preferredAreas)) {
    res.status(400).json({
      message: "All fields are required including preferred areas."
    });
    return;
  }

  try {
    // Check if buyer already exists
    let buyer = await prisma.buyer.findFirst({
      where: {
        OR: [{ email: email.toLowerCase() }, { phone }],
      },
    });

    if (buyer) {
      // Update existing buyer with VIP status and preferred areas
      buyer = await prisma.buyer.update({
        where: { id: buyer.id },
        data: {
          firstName,
          lastName,
          buyerType,
          preferredAreas, // Include preferred areas in update
          source: "VIP Buyers List", 
        },
      });
    } else {
      // Create new buyer with VIP status and preferred areas
      buyer = await prisma.buyer.create({
        data: {
          email: email.toLowerCase(),
          phone,
          buyerType,
          firstName,
          lastName,
          preferredAreas, // Include preferred areas in creation
          source: "VIP Buyers List", 
        },
      });
    }

    res.status(201).json({
      message: "VIP Buyer created successfully.",
      buyer,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "An error occurred while processing the request.",
      error: err.message,
    });
  }
});


// Get all buyers
export const getAllBuyers = asyncHandler(async (req, res) => {
  try {
    const buyers = await prisma.buyer.findMany({
      include: {
        offers: {
          select: {
            id: true,
            propertyId: true,
            offeredPrice: true,
            timestamp: true
          },
          orderBy: {
            timestamp: "desc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    
    res.status(200).json(buyers);
  } catch (err) {
    console.error("Error fetching buyers:", err);
    res.status(500).json({
      message: "An error occurred while fetching buyers",
      error: err.message
    });
  }
});

// Get buyer by ID
export const getBuyerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "Buyer ID is required" });
  }
  
  try {
    const buyer = await prisma.buyer.findUnique({
      where: { id },
      include: {
        offers: {
          select: {
            id: true,
            propertyId: true,
            offeredPrice: true,
            timestamp: true
          },
          orderBy: {
            timestamp: "desc"
          }
        }
      }
    });
    
    if (!buyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    
    res.status(200).json(buyer);
  } catch (err) {
    console.error("Error fetching buyer:", err);
    res.status(500).json({
      message: "An error occurred while fetching the buyer",
      error: err.message
    });
  }
});

// Update buyer
export const updateBuyer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone,
    buyerType,
    source,
    preferredAreas
  } = req.body;
  
  if (!id) {
    return res.status(400).json({ message: "Buyer ID is required" });
  }
  
  try {
    // Check if buyer exists
    const existingBuyer = await prisma.buyer.findUnique({
      where: { id }
    });
    
    if (!existingBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    
    // Check if email is changing and if it's already in use
    if (email !== existingBuyer.email) {
      const emailExists = await prisma.buyer.findUnique({
        where: { email: email.toLowerCase() }
      });
      
      if (emailExists && emailExists.id !== id) {
        return res.status(400).json({ message: "Email already in use by another buyer" });
      }
    }
    
    // Check if phone is changing and if it's already in use
    if (phone !== existingBuyer.phone) {
      const phoneExists = await prisma.buyer.findUnique({
        where: { phone }
      });
      
      if (phoneExists && phoneExists.id !== id) {
        return res.status(400).json({ message: "Phone number already in use by another buyer" });
      }
    }
    
    // Update the buyer
    const updatedBuyer = await prisma.buyer.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        buyerType,
        source,
        preferredAreas: preferredAreas || []
      },
      include: {
        offers: true
      }
    });
    
    res.status(200).json(updatedBuyer);
  } catch (err) {
    console.error("Error updating buyer:", err);
    res.status(500).json({
      message: "An error occurred while updating the buyer",
      error: err.message
    });
  }
});

// Delete buyer
export const deleteBuyer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({ message: "Buyer ID is required" });
  }
  
  try {
    // Check if buyer exists
    const existingBuyer = await prisma.buyer.findUnique({
      where: { id }
    });
    
    if (!existingBuyer) {
      return res.status(404).json({ message: "Buyer not found" });
    }
    
    // First delete all offers from this buyer (due to foreign key constraint)
    await prisma.offer.deleteMany({
      where: { buyerId: id }
    });
    
    // Then delete the buyer
    const deletedBuyer = await prisma.buyer.delete({
      where: { id }
    });
    
    res.status(200).json({
      message: "Buyer and associated offers deleted successfully",
      buyer: deletedBuyer
    });
  } catch (err) {
    console.error("Error deleting buyer:", err);
    res.status(500).json({
      message: "An error occurred while deleting the buyer",
      error: err.message
    });
  }
});


// Create a regular buyer
export const createBuyer = asyncHandler(async (req, res) => {
  const {
    email,
    phone,
    buyerType,
    firstName,
    lastName,
    source,
    preferredAreas
  } = req.body;

  // Validate required fields
  if (!email || !phone || !buyerType || !firstName || !lastName) {
    res.status(400).json({
      message: "Email, phone, buyerType, firstName, and lastName are required."
    });
    return;
  }

  try {
    // Check if buyer already exists with this email or phone
    const existingBuyer = await prisma.buyer.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { phone }
        ]
      }
    });

    if (existingBuyer) {
      res.status(409).json({
        message: "A buyer with this email or phone number already exists.",
        existingBuyer
      });
      return;
    }
    
    // Create new buyer
    const buyer = await prisma.buyer.create({
      data: {
        email: email.toLowerCase(),
        phone,
        buyerType,
        firstName,
        lastName,
        source: source || "Manual Entry",
        preferredAreas: preferredAreas || []
      }
    });

    res.status(201).json({
      message: "Buyer created successfully.",
      buyer
    });
  } catch (err) {
    console.error("Error creating buyer:", err);
    res.status(500).json({
      message: "An error occurred while processing the request.",
      error: err.message
    });
  }
});