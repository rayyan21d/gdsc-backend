import { Router } from "express";
import { userRouter } from "./routes/user";

const apiRouter = Router();


apiRouter.use("/user", userRouter);














export {apiRouter};