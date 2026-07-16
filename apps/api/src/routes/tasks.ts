/**
 * Holds all routes that act on task related endpoints
 */

import  Router from 'express';
import { validateTask, validateTaskUpdate, validateId } from '../middleware/validation.js';
import * as taskController from "../controllers/taskController.js";


// the router associated with tasks
export const taskRouter = Router();

/**
 * The /tasks get request. Returns all known tasks
 */
taskRouter.get("/tasks", taskController.getAllTasks);

/**
 * The /tasks/:id get request. Returns a specific task if found, otherwise 404
 */
taskRouter.get("/tasks/:id", validateId, taskController.getTask);

/**
 * The /tasks post request. Adds a new task to the task database and sets the ID
 */
taskRouter.post("/tasks", validateTask, taskController.createTask);

/**
 * The /tasks/:id PATCH request. Updates the send fields of the task. Returns 404 if not found. At least one required field must be present
 */
taskRouter.patch("/tasks/:id", validateId, validateTaskUpdate, taskController.updateTask);

/**
 * Deletes a task. Returns 404 if the task is not found
 */
taskRouter.delete("/tasks/:id", validateId, taskController.deleteTask);
