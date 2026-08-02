/**
 * Holds all middleware related to authorizing users
*/

import type { Request, Response, NextFunction } from "express";
import { HttpStatus, type UserJwtPayload, Role } from "../types.js";
import { config } from "../constants.js";
import jwt from 'jsonwebtoken';

/**
 * Helper that isolates token from an Authorization header
 * 
 * @param header - a string representing the authorization header
 */
function isolateToken(header: string) {
    if(!header.startsWith("Bearer ")) {
        return null;
    }

    return header.slice("Bearer ".length);
}

/**
 * Ensures that the incoming request contains a valid JWT token
 * 
 * @param req the incoming request
 * @param res the outgoing response
 * @param next the callback to call the next middleware
 */
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

/**
 * EEnforces that the user has the ADMIN role before access to the endpoint is granted
 * 
 * @param req the incoming request
 * @param res the outgoing response
 * @param next the callback to call the next middleware
 */
export function requiresAdmin(req: Request, res: Response, next: NextFunction) {
    const role = req.user?.role;

    // Somehow we have received a request without any authentication
    if (!role) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error"});
    }

    if (role !== Role.ADMIN) {
        return res.status(HttpStatus.FORBIDDEN).json({error: "You are not authorized to access this resource."});
    }

    next();
}
