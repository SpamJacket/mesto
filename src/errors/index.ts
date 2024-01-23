import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "./not-found-err";

export default (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  if (err instanceof NotFoundError) {
    res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(StatusCodes.BAD_REQUEST).send({ message: "Невалидный id" });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Переданы некорректные данные" });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: "На сервере произошла ошибка" });
};
