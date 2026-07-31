/**
 * Holds all routes that act on user related endpoints
 */

import { Router } from 'express';
import { validateUserRegistration } from '../middleware/validation.js'
import * as userController from "../controllers/userController.js";

export const userRouter = Router();

/**
 * Endpoint responsible for logging user in
 */
userRouter.post("/auth/login", userController.loginUser);

/**
 * Endpoint responsible for registering user
 */
userRouter.post("/auth/register", validateUserRegistration, userController.registerUser);
