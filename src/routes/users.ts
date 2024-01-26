import { Router } from "express";
import {
  getUsers,
  getUser,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} from "../controllers/users";

const router = Router();

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", getUser);
router.patch("/me", updateProfile);
router.patch("/me/avatar", updateAvatar);

export default router;
