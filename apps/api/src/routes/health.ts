import  Router, { type Request, type Response } from 'express';
import { pool } from "../db/pool.js";
import { HttpStatus } from '../types.js';

export const healthRouter = Router();

healthRouter.get("/health", async (req: Request, res: Response) => {
    try {
        await pool.query("SELECT 1");
        return res.status(HttpStatus.OK).json({status : "OK"});
    } catch (error) {
        console.error("Error occurred when getting the health of the database: " + error);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error : "Heath check has failed."});
    }
});
