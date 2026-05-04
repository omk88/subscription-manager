import { auth } from "../config/auth";
import { Router } from "express";

const authRouter = Router();

authRouter.all("/api/auth/*", (req, res) => {
    return auth.handler(req as any);
});

export default authRouter;