


// Add remove update projects
// Fetch events
import { PrismaClient } from '@prisma/client';
import express from 'express';
import { authMiddleWare } from '../middlewares/auth';
const eventRouter = express.Router();

const client = new PrismaClient();


eventRouter.get("/", async (req, res) => {

    try{
        const events = await client.event.findMany();
        res.status(200).json(events);

    }
    catch(e){
        console.log(e);
        return res.status(500).json({message: "Internal Server Error"});
    }
    finally{
        client.$disconnect();
    }
    
})



// Create events
eventRouter.post("/", authMiddleWare, async (req, res) => {

    
    const {title, description, date, organizers, volunteers, speakers} = req.body;
    const id = req.headers.userId as string;

    try{

        const newEvent = await client.event.create({
            data: {
                title,
                description,
                date,
                creatorId: id,
                organizers: organizers,
                volunteers: volunteers,
                speakers: speakers,
                
            }
        });

        res.status(201).json(newEvent);
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

// Update Events

// Delete Events











export {eventRouter};