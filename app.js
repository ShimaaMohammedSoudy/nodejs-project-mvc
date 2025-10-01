import express from "express"
import userRoutes from "./modules/users/userRoutes.js";
import postRoutes from "./modules/posts/postRoutes.js";
import commentRoutes from "./modules/comments/commentRoutes.js";



const app=express();
app.use(express.json());
app.use(userRoutes)
app.use(postRoutes)
app.use("/comments", commentRoutes);


app.listen(3000,()=>{


    console.log("server is running on 3000");
})