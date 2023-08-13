import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";

const secretoJWT: string = 'NuestraClaveEA3';


export async function verifyToken(req: Request, res: Response, next: NextFunction) {
    console.log('VerifyToken');
    const token = req.headers['x-access-token'] as string;
    console.log(token);
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }
    try {

        jwt.verify(token, secretoJWT);
        
        next();
    } catch (error) {
        return res.status(401).json({ auth: false, message: 'Unauthorized' });
    }
};

export async function isModerator(req: Request, res: Response, next: NextFunction) {
   console.log('isModerator');
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: "No user found." });
    }
    const roles = user.isAdmin;
    if (roles === true) {
        next();
    } else {
        return res.status(401).json({ auth: false, message: "Not Moderator" });
    }
};


