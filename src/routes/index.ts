import { Router } from "express";
import userRouter from "./users";
import cardsRouter from "./cards";
import { login, createUser } from "../controllers/users";

const router = Router();

router.use("/users", userRouter);
router.use("/cards", cardsRouter);
router.post("/signin", login);
router.post("/signup", createUser);

export default router;
