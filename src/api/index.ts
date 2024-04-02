import { Router } from "express";
import { userRouter } from "./routes/user";
import { postRouter } from "./routes/post";
import { eventRouter } from "./routes/event";
import { projectRouter } from "./routes/project";
import { adminRouter } from "./routes/admin";

const apiRouter = Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/admin", adminRouter);

apiRouter.use("/events", eventRouter);
apiRouter.use("/post", postRouter);
apiRouter.use("/projects", projectRouter);


export {apiRouter};