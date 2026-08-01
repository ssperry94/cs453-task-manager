/**
 * Holds all routes that act on task related endpoints
 */

import  Router from 'express';
import { validateId, validateProjectCreation } from '../middleware/validation.js';
import { authenticateRequest } from '../middleware/authorization.js';
import * as projectController from "../controllers/projectController.js";

export const projectRouter = Router();

/**
 * Router to get all projects
 */
projectRouter.get("/projects", authenticateRequest, projectController.getAllProjects);

/**
 * Route to get a specific project
 */
projectRouter.get("/projects/:id", authenticateRequest, validateId, projectController.getProject);

/**
 * Route to create a new project
 */
projectRouter.post("/projects", authenticateRequest, validateProjectCreation, projectController.createProject);
