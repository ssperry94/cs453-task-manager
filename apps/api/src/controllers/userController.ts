import { type Request, type Response } from 'express';
import { HttpStatus } from '../types.js';
import bcrypt from 'bcrypt'
import { BCRYPT_COST } from '../constants.js';
import { pool } from '../db/pool.js';
import { DatabaseError } from 'pg';

export async function loginUser(req: Request, res: Response) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Not implemented."});
}

export async function registerUser(req: Request, res: Response) {
    const name = req.body.name;
    const email = req.body.email;
    const password = await bcrypt.hash(req.body.password_hash, BCRYPT_COST);

    try {
      const result = await pool.query(
        `
          INSERT INTO users (name, email, password_hash, role)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `,
        [name, email, password, 'user']
      );

      return res.status(HttpStatus.CREATED).json(result.rows[0]);
    } catch (error) {
      console.error("Failed to register user:", error);

      // The email's unique key status was violated, meaning this user is already registered
      if (error instanceof DatabaseError && error.code === '23505') {
        return res.status(HttpStatus.BAD_REQUEST).json({error: "User with that email already registered."});        
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error"});
    }
}