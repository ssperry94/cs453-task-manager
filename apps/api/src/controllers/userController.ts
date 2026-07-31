import { type Request, type Response } from 'express';
import { HttpStatus } from '../types.js';

export async function loginUser(req: Request, res: Response) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Not implemented."});
}

export async function registerUser(req: Request, res: Response) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Not implemented."});
}