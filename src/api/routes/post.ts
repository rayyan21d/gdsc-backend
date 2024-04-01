import { Router, Request, Response } from "express";


import { PrismaClient } from "@prisma/client";
import { authMiddleWare } from "../middlewares/auth";
const client = new PrismaClient();


const postRouter = Router();

postRouter.use(authMiddleWare);


postRouter.get("/", (req, res) => {})


postRouter.post("/",async (req, res) => {

    try{

        const {title, content, id} = req.body;

      

        const newPost = await client.post.create({
            data: {
                title,
                content,
                creatorId: id,
                comments: {}
            }
        });

        res.status(201).json(newPost);
    }catch(err){
        console.log(err);
        client.$disconnect();
        return res.status(500).json({
            message: "Internal Server Error"
        });
    } finally{
        client.$disconnect();
        
    }
})

postRouter.put("/:id", async (req, res) => {})

postRouter.delete("/:id", async (req, res) => {})




postRouter.post("/:id/comment", async (req, res) => {})

postRouter.put("/:id/comment", async (req, res) => {})

postRouter.delete("/:id/comment", async (req, res) => {})






export {postRouter};