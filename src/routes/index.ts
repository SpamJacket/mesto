import { NextFunction, Router } from "express";
import { celebrate, Joi } from "celebrate";
import userRouter from "./users";
import cardsRouter from "./cards";
import { login, createUser } from "../controllers/users";
import auth from "../middlewares/auth";
import NotFoundError from "../errors/not-found-err";

const router = Router();

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string().pattern(
        /https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=]{1,256}\.[a-zA-Z0-9]{1,6}\/(([-a-zA-Z0-9()@:%_+.~#?&//=]*)\.(jpg|png|jpeg|gif))/
      ),
    }),
  }),
  createUser
);

router.use(auth);

router.use("/users", userRouter);
router.use("/cards", cardsRouter);

router.use(
  "/*",
  (req, res, next: NextFunction) =>
    next(new NotFoundError("Страница не найдена"))
  // eslint-disable-next-line function-paren-newline
);

export default router;
