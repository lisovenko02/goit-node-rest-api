import express from "express";
import validateBody from "../helpers/validateBody.js";
import { emailSchema, registerAndLoginSchema, updateSubscriptionSchema } from "../models/user.js";
import { register, login, logout, getCurrent, updateSubscription, updateAvatar, verifyEmail, resendVerifyEmail } from "../controllers/authControllers.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerAndLoginSchema), register)

authRouter.get("/verify/:verificationToken", verifyEmail);

authRouter.post("/verify", validateBody(emailSchema), resendVerifyEmail);

authRouter.post("/login", validateBody(registerAndLoginSchema), login)

authRouter.post("/logout", authenticate , logout);

authRouter.get("/current", authenticate, getCurrent)

authRouter.patch("/", authenticate, validateBody(updateSubscriptionSchema), updateSubscription)

authRouter.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar)

export default authRouter;
