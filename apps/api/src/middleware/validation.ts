import {
    TaskCreationSchema,
    TaskUpdateSchema,
    HttpStatus,
    IdSchema,
    UserCreationSchema,
    UserLoginSchema,
    ProjectCreationSchema 
} from "../types.js";

import { type Request, type Response, type NextFunction } from 'express';

/**
 * Validates a task object from a response body
 * @param req the incoming request
 * @param res the outgoing response
 * @param next a function to call the next middleware
 * @returns a BAD REQUEST if errors are detected, or just proceeds to next middleware on success
 */
export function validateTask(req: Request, res: Response, next: NextFunction) {
    // Verify the incoming task has all correct types and fields
    const result = TaskCreationSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.error.issues);
    }

    next();
}

/**
 * Validates an ID parameter from an incoming request
 * @param req the incoming request
 * @param res the outgoing response
 * @param next a function to call the next middleware
 * @returns a BAD REQUEST if errors are detected, or just proceeds to next middleware on success
 */
export function validateId(req: Request, res: Response, next: NextFunction) {
    const result = IdSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.error.issues);
    }

    next();
}

/**
 * Validates a task object to make sure at least one required field is present
 * @param req the incoming request
 * @param res the outgoing response
 * @param next a function to call the next middleware
 * @returns a BAD REQUEST if errors are detected, or just proceeds to next middleware on success
 */
export function validateTaskUpdate(req: Request, res: Response, next: NextFunction) {
    const result = TaskUpdateSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.error.issues);
    }

    next();
}

export function validateProjectCreation(req: Request, res: Response, next: NextFunction) {
    const result = ProjectCreationSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.error.issues);
    }

    next();
}

export function validateUserRegistration(req: Request, res: Response, next: NextFunction) {
    const result = UserCreationSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.error.issues);
    }

    next();
}

export function validateUserLogIn(req: Request, res: Response, next: NextFunction) {
    const result = UserLoginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.error.issues);
    }

    next();
}
