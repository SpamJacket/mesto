import { Router } from "express";
import userRouter from "./users";
import cardsRouter from "./cards";

const router = Router();

router.use("/users", userRouter);
router.use("/cards", cardsRouter);

export default router;
