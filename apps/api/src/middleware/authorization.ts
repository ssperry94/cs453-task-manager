/**
 * Holds all middleware related to authorizing users
*/

import type { Request, Response, NextFunction } from "express";
import { HttpStatus, type UserJwtPayload } from "../types.js";
import { config } from "../constants.js";
import jwt from 'jsonwebtoken';

/**
 * Helper that isolates token from an Authorization header
 * 
 * @param header - a string representing the authorization header
 */
function isolateToken(header: string) {
    console.log("Header: ", header);
    if(!header.startsWith("Bearer ")) {
        return null;
    }

    return header.slice("Bearer ".length);
}

export function authenticateRequest(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.get("authorization");

    if (!authHeader) {
        return res.status(HttpStatus.UNAUTHORIZED).json({error: "User does not have proper authorization."});
    }

    const token = isolateToken(authHeader);

    if (!token) {
        return res.status(HttpStatus.UNAUTHORIZED).json({error: "User does not have proper authorization."}); 
    }

    try {
        // Export the payload as our custom payload with our user field used in the Request object
        req.user = jwt.verify(token, config.JWT_SECRET) as UserJwtPayload;
        next();
    } catch {
        return res.status(HttpStatus.UNAUTHORIZED).json({error: "User does not have proper authorization."}); 
    }
}
