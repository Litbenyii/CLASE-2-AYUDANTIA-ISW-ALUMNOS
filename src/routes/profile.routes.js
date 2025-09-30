import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getPublicProfile,
  getPrivateProfile,
  updateMyProfile,
  deleteMyAccount,
} from "../controllers/profile.controller.js";

const router = Router();

router.get("/public", getPublicProfile);

router.get("/private", authMiddleware, getPrivateProfile);

router.patch("/private", authMiddleware, updateMyProfile);
router.delete("/private", authMiddleware, deleteMyAccount);

export default router;
