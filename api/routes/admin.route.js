// routes/admin.routes.js
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { verifyAdmin } from "../utils/verifyAdmin.js";
import {
  getAllUsers,
  deleteUser,
  getAllListings,
  deleteListing,
} from "../controllers/admin.controller.js";

const router = express.Router();

// Middleware de sécurité
router.use(verifyToken, verifyAdmin);

// Routes utilisateurs
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);

// Routes listings
router.get("/listings", getAllListings);
router.delete("/listings/:id", deleteListing);

export default router;
