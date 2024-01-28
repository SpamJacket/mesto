import { Response, NextFunction, ErrorRequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

const errorHandler: ErrorRequestHandler = (
  err,
  req,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const message =
    statusCode === StatusCodes.INTERNAL_SERVER_ERROR
      ? "На сервере произошла ошибка"
      : err.message;

  res.status(statusCode).send({ message });
  next();
};

export default errorHandler;
