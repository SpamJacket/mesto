import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";
import "dotenv/config";
import router from "./routes/index";
import errorHandler from "./errors/index";
import { requestLogger, errorLogger } from "./middlewares/logger";

const { PORT = 3000, MONGO_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

const connect = async () => {
  await mongoose.connect(MONGO_URL);
  console.log("App connect to data base");

  await app.listen(+PORT);
  console.log(`App listening on port ${PORT}`);
};

connect();
