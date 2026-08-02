// Extend the Express request object to have a user field or else TypeScript will not recognize the user field
import {Express} from "express-serve-static-core";
declare module 'express-serve-static-core' {
    interface Request {
        user?: {
            userId: number,
            name: string,
            email: string,
            role: string
        }
    }
}
