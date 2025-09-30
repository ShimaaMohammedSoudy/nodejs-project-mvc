import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken.js";
import { isAdmin } from "../../middlewares/authMiddleware.js";

import {SignUP,Login,getProfile,updateProfile,getAllUsers} from "./userController.js";


const userRoutes = Router()

userRoutes.post("/signup",SignUP)
userRoutes.post("/login",Login)

userRoutes.get("/profile", verifyToken, getProfile);
userRoutes.put("/profile", verifyToken, updateProfile);
userRoutes.get("/all-users", verifyToken, isAdmin, getAllUsers);

export default userRoutes;