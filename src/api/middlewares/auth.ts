import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface middleWareParams{
    req: Request,
    res: Response,
    next: NextFunction

}

async function authMiddleWare({req, res, next}: middleWareParams){
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }

    try{
        const user = jwt.verify(token, 'secret');
        next();
    }catch(err){
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
}

export {authMiddleWare};