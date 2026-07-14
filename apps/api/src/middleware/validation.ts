import { TaskCreationSchema, HttpStatus } from "../types.js";
import { type Request, type Response, type NextFunction } from 'express';

export function validateTask(req: Request, res: Response, next: NextFunction) {
    // Verify the incoming task has all correct types and fields
    const result = TaskCreationSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({errors: result.error.issues});
    }

    next();
}
