import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { MongoServerError } from "mongodb";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";
import NotFoundError from "../errors/not-found-err";
import IncorrectDataError from "../errors/incorrect-data-err";
import ConflictError from "../errors/conflict-err";

const { JWT_SECRET = "some-secret-key" } = process.env;

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find({});

    return res
      .status(StatusCodes.OK)
      .send({ data: users, message: "Пользователи успешно получены" });
  } catch (err) {
    return next(err);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).orFail(
      () => new NotFoundError("Запрашиваемый пользователь не найден")
    );

    return res
      .status(StatusCodes.OK)
      .send({ data: user, message: "Пользователь успешно получен" });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      return next(new IncorrectDataError("Невалидный id"));
    }

    return next(err);
  }
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name, about, avatar }: { [key: string]: string } =
      req.body;

    if (password.length < 8) {
      throw new mongoose.Error.ValidationError();
    }

    const hash = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });

    return res.status(StatusCodes.CREATED).send({
      data: { email, name, about, avatar },
      message: "Пользователь успешно создан",
    });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new IncorrectDataError("Переданы некорректные данные"));
    }

    if (err instanceof MongoServerError && err.code === 11000) {
      return next(new ConflictError("Такой адрес почты уже зарегистрирован"));
    }

    return next(err);
  }
};

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).orFail(
      () => new NotFoundError("Запрашиваемый пользователь не найден")
    );

    return res
      .status(StatusCodes.OK)
      .send({ data: user, message: "Пользователь успешно получен" });
  } catch (err) {
    return next(err);
  }
};

const updateUserData = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body }: { body: { [key: string]: string } } = req;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId, body, {
      new: true,
      runValidators: true,
    }).orFail(() => new NotFoundError("Запрашиваемый пользователь не найден"));

    return res
      .status(StatusCodes.OK)
      .send({ data: user, message: "Профиль успешно обновлен" });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new IncorrectDataError("Переданы некорректные данные"));
    }

    return next(err);
  }
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => updateUserData(req, res, next);

export const updateAvatar = (req: Request, res: Response, next: NextFunction) =>
  updateUserData(req, res, next);

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password }: { [key: string]: string } = req.body;

    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: (user as IUser)._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res
      .status(StatusCodes.OK)
      .cookie("accessToken", token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .send({ message: "Пользователь успешно авторизован" });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      return next(new IncorrectDataError("Переданы некорректные данные"));
    }

    return next(err);
  }
};
