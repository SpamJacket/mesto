import mongoose from "mongoose";
import { MongoServerError } from "mongodb";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import NotFoundError from "./not-found-err";
import AuthError from "./auth-err";

export default (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line no-unused-vars
  next: NextFunction
) => {
  if (err instanceof NotFoundError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof AuthError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Невалидный id" });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Переданы некорректные данные" });
  }

  if (err instanceof MongoServerError && err.code === 11000) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: "Такой адрес почты уже зарегистрирован" });
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .send({ message: "На сервере произошла ошибка" });
};
