import "dotenv/config";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Request, Response, NextFunction } from "express";
import AuthError from "../errors/auth-err";

interface JwtPayload {
  _id: string | Types.ObjectId;
}

const { JWT_SECRET = "some-secret-key" } = process.env;

export default (req: Request, res: Response, next: NextFunction) => {
  const { accessToken }: { [key: string]: string } = req.cookies;

  if (!accessToken) {
    throw new AuthError("Необходима авторизация");
  }

  let payload: JwtPayload | null = null;

  try {
    payload = jwt.verify(accessToken, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return next(new AuthError("Необходима авторизация"));
  }

  req.user = payload;
  return next();
};
