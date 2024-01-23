import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import router from "./routes/index";
import errorHandler from "./errors/index";

const { PORT = 3000, MONGO_URL = "mongodb://127.0.0.1:27017/mestodb" } =
  process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: "65a97ea483ec892c8df70f4a",
  };

  next();
});

app.use(router);

app.use(errorHandler);

const connect = async () => {
  await mongoose.connect(MONGO_URL);
  console.log("App connect to data base");

  await app.listen(+PORT);
  console.log(`App listening on port ${PORT}`);
};

connect();
