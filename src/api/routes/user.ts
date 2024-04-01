import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import {z} from "zod";
import { env } from "process";

import { authMiddleWare } from "../middlewares/auth";

import { PrismaClient } from "@prisma/client";
import dotenv from 'dotenv';
const client = new PrismaClient();

const userRouter = Router();


userRouter.get("/", (req, res) => {
    console.log("GET /user");
});


const passwordSchema = z.string().min(6);
const emailSchema = z.string().email();
const firstName = z.string().max(20)
const lastName = z.string().max(20)

userRouter.post("/signup", async (req, res)=>{

    const {memberId, password, email, firstName, lastName, phone} = req.body;
    const {bio, profilePic, interests, socials,} = req.body;

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
        else{

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

            const userProfile = await client.profile.create({

                data:{
                userId: newUser.id,
                bio,
                profilePicture:profilePic,
                interests,
                socials
                }
                
                
            });


            const token = jwt.sign({data: newUser.id}, 'secret' , {  expiresIn: '60h' });

            const payload = {
                message: "User profile created",
                jwtToken: token
            }

            res.status(201).json(payload);

        }

        

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
                message: "User Does not exist"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid Credentials"
            });
        }

        const token = jwt.sign({data: user.id}, 'secret' , {  expiresIn: '60h' });

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


// userRouter.get("/profile", authMiddleWare, async ( req, res)=>{

//     try{

//         // returns
//         // username, firstName, lastName, email, phone, bio, profilepic, interests[], events[], socials[], projects[], roles[]

//         const {memberId} = req.body;
    
//         const profile = await client.user.findUnique({
//             where:{
//                 memberId
//             }

//         })

//         const info = await client.profile.findUnique({
//             where:{
//                 userId:memberId
//             }
//         })

//         const payload = {
//             memberId: profile.memberId,
//             firstName: profile.firstName,
//             lastName: profile.lastName,
//             email: profile.email,
//             phone: profile.phone,
//             bio: info.bio,
//             profilePic: info.profilePic,
//             interests: info.interests,
//             events: info.events,
//             socials: info.socials,
//             projects: info.projects,
//             roles: info.roles
//         }
    
//         const dummyLoad = {
//             memberId: "123",
//             firstName: "John",
//             lastName: "Doe",
//             email: "sanpi@gmial.com"
//         }


//         return res.status(200).json(payload);



//     }catch(err){

//     }finally{

//     }



// })


userRouter.put("/profile", authMiddleWare, async (req: Request, res:Response )=>{

    const {bio, profilePic, interests, events, socials, projects, roles} = await req.body;
    var userId: any;

    if(req.headers.userId != undefined ){
        userId = req.headers.userId;
    }
    

    try{

        const updatedProfile = await client.profile.update ({
        
            where:{
                userId: parseInt(userId),

            }, 
            data: {
                bio,
                profilePicture:profilePic,
                interests,
                events,
                socials,
                projects,
            }
                
        });

        console.log(updatedProfile);

        return res.status(200).json({
            message:"Profile updated successfully!"
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