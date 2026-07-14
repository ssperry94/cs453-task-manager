import { TaskCreationSchema, TaskUpdateSchema, HttpStatus, IdSchema } from "../types.js";
import { type Request, type Response, type NextFunction } from 'express';

export function validateTask(req: Request, res: Response, next: NextFunction) {
    // Verify the incoming task has all correct types and fields
    const result = TaskCreationSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.error.issues);
    }

    next();
}

export function validateId(req: Request, res: Response, next: NextFunction) {
    const result = IdSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.error.issues);
    }

    next();
}

export function validateTaskUpdate(req: Request, res: Response, next: NextFunction) {
    const result = TaskUpdateSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json(result.error.issues);
    }

    next();
}
