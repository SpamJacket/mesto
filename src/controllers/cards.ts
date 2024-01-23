import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import Card from "../models/card";
import NotFoundError from "../errors/not-found-err";

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cards = await Card.find({}).populate("owner");
    return res.status(StatusCodes.OK).send({ data: cards });
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
    const { name, link } = req.body;
    const owner = req.user._id;
    const card = await Card.create({ name, link, owner });
    return res.status(StatusCodes.CREATED).send({ data: card });
  } catch (err) {
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
    const card = await Card.findByIdAndDelete(cardId).orFail(
      () => new NotFoundError("Запрашиваемая карточка не найдена")
    );
    return res.status(StatusCodes.OK).send({ data: card });
  } catch (err) {
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
    return res.status(StatusCodes.OK).send({ data: card });
  } catch (err) {
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
    return res.status(StatusCodes.OK).send({ data: card });
  } catch (err) {
    return next(err);
  }
};
