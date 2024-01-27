/* eslint-disable no-unused-vars */
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: { _id: string | Types.ObjectId };
    }
  }
}
