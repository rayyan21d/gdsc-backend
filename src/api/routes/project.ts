


// Create projects
// Add, remove, update projects
// Get projects

import express from 'express';
import { PrismaClient } from '@prisma/client';

const projectRouter = express.Router();

const client = new PrismaClient();


projectRouter.get("/", async (req, res) => {

    try{
        const projects= await client.project.findMany();
        res.status(200).json(projects);

    }
    catch(e){
        console.log(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
    finally{
        client.$disconnect();
    }
    
})





export {projectRouter};