import express from "express";
const authRouter = express.Router();
import {
  signup,
  signin,
  getUser,
  logout,
} from "../controller/authController.js";
import jwtAuth from "../middleware/jwtAuth.js";

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.get("/user", jwtAuth, getUser);
authRouter.get("/logout", jwtAuth, logout);

export default authRouter;
