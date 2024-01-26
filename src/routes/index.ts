import { Router } from "express";
import userRouter from "./users";
import cardsRouter from "./cards";
import { login, createUser } from "../controllers/users";
import auth from "../middlewares/auth";

const router = Router();

router.post("/signin", login);
router.post("/signup", createUser);
router.use(auth);
router.use("/users", userRouter);
router.use("/cards", cardsRouter);

export default router;
