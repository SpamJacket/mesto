import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";
import NotFoundError from "../errors/not-found-err";

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
    const user = await User.create({
      email,
      password: hash,
      name,
      about,
      avatar,
    });

    return res
      .status(StatusCodes.CREATED)
      .send({ data: user, message: "Пользователь успешно создан" });
  } catch (err) {
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

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, about, avatar }: { [key: string]: string } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, about, avatar },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Запрашиваемый пользователь не найден"));

    return res
      .status(StatusCodes.OK)
      .send({ data: user, message: "Профиль успешно обновлен" });
  } catch (err) {
    return next(err);
  }
};

export const updateAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { avatar }: { [key: string]: string } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true }
    ).orFail(() => new NotFoundError("Запрашиваемый пользователь не найден"));

    return res
      .status(StatusCodes.OK)
      .send({ data: user, message: "Аватар успешно обновлен" });
  } catch (err) {
    return next(err);
  }
};

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
      .cookie("accessToken", `Bearer ${token}`, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .send({ data: user, message: "Пользователь успешно авторизован" });
  } catch (err) {
    return next(err);
  }
};
