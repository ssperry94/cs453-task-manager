import { type Request, type Response } from 'express';
import { HttpStatus } from '../types.js';
import bcrypt from 'bcrypt'
import { BCRYPT_COST } from '../constants.js';
import { pool } from '../db/pool.js';
import { DatabaseError } from 'pg';
import jwt from "jsonwebtoken";
import { config, jwtExpiresIn } from '../constants.js';

export async function loginUser(req: Request, res: Response) {
  const email = req.body.email;
  const password = req.body.password_hash;

  try {
    const result = await pool.query(
      "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];

    // Determine if the user has valid log in credentials
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(HttpStatus.UNAUTHORIZED).json({error: "Email or password could not be verified."});
    }

    const jwtToken = jwt.sign(
      {userId: user.id, name: user.name, email: user.email, role: user.role},
      config.JWT_SECRET,
      {expiresIn: jwtExpiresIn}
    );

    return res.status(HttpStatus.OK).json({
      accessToken: jwtToken,
      tokenType: "Bearer",
      expiresIn: jwtExpiresIn,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login attempt failed.", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error."});
  }
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