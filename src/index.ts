import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import {apiRouter }from "./api/index";


dotenv.config();

const port = process.env.PORT || 3000;
const app: Express = express();

app.use(cors());
app.use(express.json());


app.use("/api", apiRouter)
app.listen(port, ()=>{ console.log("Listening on 3000")})