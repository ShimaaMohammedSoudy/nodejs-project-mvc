import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken.js";

import {  createPost, getAllPosts, getPostById, updatePost, deletePost} from "./postController.js";

const postRoutes = Router();

// Public routes
postRoutes.get("/all", getAllPosts);
postRoutes.get("/:id", getPostById);

// Protected routes (user or admin)
postRoutes.post("/create", verifyToken, createPost);
postRoutes.put("/update/:id", verifyToken, updatePost);
postRoutes.delete("/delete/:id", verifyToken, deletePost);

export default postRoutes;
