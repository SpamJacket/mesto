import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import userRouter from "./users";
import cardsRouter from "./cards";
import { login, createUser } from "../controllers/users";
import auth from "../middlewares/auth";

const router = Router();

router.post(
  "/signin",
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  login
);
router.post(
  "/signup",
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(200),
        avatar: Joi.string().uri({
          scheme: ["jpeg", "jpg", "png", "bmp", "svg"],
        }),
      })
      .unknown(true),
  }),
  createUser
);

router.use(auth);

router.use("/users", userRouter);
router.use("/cards", cardsRouter);

export default router;
