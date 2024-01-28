import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Card from "../models/card";
import NotFoundError from "../errors/not-found-err";
import AccessError from "../errors/access-err";
import IncorrectDataError from "../errors/incorrect-data-err";

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({}).populate("owner");

    return res
      .status(StatusCodes.OK)
      .send({ data: cards, message: "Карточки успешно получены" });
  } catch (err) {
    return next(err);
  }
};

export const createCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, link }: { [key: string]: string } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });

    return res
      .status(StatusCodes.CREATED)
      .send({ data: card, message: "Карточка успешно создана" });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new IncorrectDataError("Переданы некорректные данные"));
    }

    return next(err);
  }
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;
    const card = await Card.findById(cardId).orFail(
      () => new NotFoundError("Запрашиваемая карточка не найдена")
    );
    const cardOwner = card.toObject().owner.toString();

    if (cardOwner !== userId) {
      throw new AccessError("Вы не можете удалить эту карточку");
    }

    const deletedCard = await Card.findByIdAndDelete(cardId);

    return res
      .status(StatusCodes.OK)
      .send({ data: deletedCard, message: "Карточка успешно удалена" });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new IncorrectDataError("Невалидный id"));
    }

    return next(err);
  }
};

export const likeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true }
    ).orFail(() => new NotFoundError("Запрашиваемая карточка не найдена"));

    return res
      .status(StatusCodes.OK)
      .send({ data: card, message: "Лайк поставлен" });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new IncorrectDataError("Невалидный id"));
    }

    return next(err);
  }
};

export const dislikeCard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cardId } = req.params;
    const userId = req.user._id;

    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    ).orFail(() => new NotFoundError("Запрашиваемая карточка не найдена"));

    return res
      .status(StatusCodes.OK)
      .send({ data: card, message: "Лайк убран" });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new IncorrectDataError("Невалидный id"));
    }

    return next(err);
  }
};
