import { Router } from "express";
import { userRouter } from "./routes/user";
import { postRouter } from "./routes/post";

const apiRouter = Router();


apiRouter.use("/user", userRouter);
apiRouter.use("/post", postRouter);


export {apiRouter};