import { Router } from "express";
import { celebrate, Joi } from "celebrate";
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
router.get(
  "/:userId",
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum(),
    }),
  }),
  getUser
);

router.patch(
  "/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string().uri({
        scheme: ["jpeg", "jpg", "png", "bmp", "svg"],
      }),
    }),
  }),
  updateProfile
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string()
        .uri({
          scheme: ["jpeg", "jpg", "png", "bmp", "svg"],
        })
        .required(),
    }),
  }),
  updateAvatar
);

export default router;
