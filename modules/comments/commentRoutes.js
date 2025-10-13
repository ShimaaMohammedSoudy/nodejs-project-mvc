import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken.js";

import { getComments, getCommentById, addComment, editComment, removeComment } from "./commentController.js";

const commentRoutes = Router();

// Public routes
commentRoutes.get("/all", getComments);
commentRoutes.get("/:id", getCommentById);

// Protected routes (user or admin)
commentRoutes.post("/create/:postId", verifyToken, addComment);
commentRoutes.put("/update/:id", verifyToken, editComment);
commentRoutes.delete("/delete/:id", verifyToken, removeComment);

export default commentRoutes;
