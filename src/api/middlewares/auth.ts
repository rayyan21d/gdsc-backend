import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { string } from 'zod';

interface JwtPayload {
  data: string;
}

async function authMiddleWare(req: Request, res: Response, next: NextFunction){

    if(req.headers.authorization&&  req.headers.authorization.length> 1){
        const token = req.headers.authorization.split(' ')[1];
        
        try{
            const decoded = jwt.verify(token, 'secret') as JwtPayload;
            req.headers.userId = decoded.data;
            console.log("Authenticated!")
            next();

        }catch(e){
            console.log(e);
            return res.json({message:"Bad Gateway"})
        }        
      
    
    }else{
        return res.json({message:"Unauthorized"})
    }
}


export {authMiddleWare};