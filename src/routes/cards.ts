import { Router } from "express";
import { celebrate, Joi } from "celebrate";
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards";

const router = Router();

router.get("/", getCards);

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      link: Joi.string()
        .uri({
          scheme: ["jpeg", "jpg", "png", "bmp", "svg"],
        })
        .required(),
    }),
  }),
  createCard
);
router.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum(),
    }),
  }),
  deleteCard
);

router.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum(),
    }),
  }),
  likeCard
);
router.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum(),
    }),
  }),
  dislikeCard
);

export default router;
