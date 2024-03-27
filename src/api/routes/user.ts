import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

const userRouter = Router();


userRouter.get("/", (req, res) => {
    console.log("GET /user");
});


userRouter.post("/signup", async (req, res)=>{

    const {memberId, password, email, firstName, lastName, phone} = req.body;

    try{

        const existingUser = await client.user.findUnique({
            where: {
                memberId
            }
        });

        if(existingUser){
            res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await client.user.create({
            data: {
                memberId,
                hashedPassword,
                email,
                firstName,
                lastName,
                phone
            }
        });

        res.status(201).json(newUser);

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    } finally{
        client.$disconnect();
    }




    // check if username is already taken
    // if it is, return 400
    // if not, create user
    // hash password
    // save user to Database
    // return 201



});


userRouter.post("/login", async (req, res)=>{

    const {memberId, password} = req.body;
    const {authorization} = req.headers;


    try{

        // Optional section!
        // if(!authorization){
        //    console.log("No Auth found!");
        // }else{
        //     const token = authorization.split(" ")[1];
        //     const decoded = await jwt.verify(token, 'secret');

        //     if(!decoded){
        //         console.log(decoded);
        //     }

        // }

        
        const user = await client.user.findUnique({
            where: {
                memberId
            }
        });

        if(!user){
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

        if(!isPasswordValid){
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign({data: user.hashedPassword}, 'secret', {  expiresIn: '1h' });

        res.status(200).json({
            message: "Login Successful",
            jwtToken: token
        });

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message: "Internal Server Error"
        });

    }finally{
        client.$disconnect();
    }



});




export {userRouter}