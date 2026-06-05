import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

/* =========================
   CREATE LISTING (FIXED)
========================= */
export const createListing = async (req, res, next) => {
  try {
    // 🔥 always take user from token (NOT frontend)
    const userId = req.user.id;

    const listing = await Listing.create({
      ...req.body,
      userRef: userId,
    });

    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE LISTING (FIXED)
========================= */
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // 🔥 ObjectId fix
    if (req.user.id !== listing.userRef.toString()) {
      return next(
        errorHandler(403, "You can only delete your own listing")
      );
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json("Listing deleted successfully");
  } catch (error) {
    next(error);
  }
};

/* =========================
   UPDATE LISTING (FIXED)
========================= */
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    // 🔥 ObjectId fix
    if (req.user.id !== listing.userRef.toString()) {
      return next(
        errorHandler(403, "You can only update your own listing")
      );
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET SINGLE LISTING
========================= */
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }

    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET ALL LISTINGS
========================= */
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const filters = {};

    if (req.query.offer !== undefined) {
      filters.offer = req.query.offer === "true";
    }

    if (req.query.type) {
      filters.type = req.query.type;
    }

    const listings = await Listing.find(filters)
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};