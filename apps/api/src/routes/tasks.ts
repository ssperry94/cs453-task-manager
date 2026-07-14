/**
 * Holds all routes that act on task related endpoints
 */

import { type Task, Status, HttpStatus } from "../types.js";
import  Router, { type Request, type Response } from 'express';
import { validateTask } from '../middleware/validation.js';

// TODO(#3): Database needs to handle ID
let currentId = 2;
// TODO(#3) Move to database
const tasks: Task[] = [
    {id: 1, title: "Dummy Task 1", status: Status.IN_PROGRESS},
    {id: 2, title: "Dummy Task 2", status: Status.TODO}
];

// the router associated with tasks
export const taskRouter = Router();

/**
 * The /tasks get request. Returns all known tasks
 */
taskRouter.get("/tasks", (req: Request, res: Response) => {
    return res.status(HttpStatus.OK).json(tasks);
});

/**
 * The /tasks post request. Adds a new task to the task database and sets the ID
 */
taskRouter.post("/tasks", validateTask, (req: Request, res: Response) => {
    const newTask = {
        id: ++currentId,
        title: req.body.title,
        status: req.body.status
    }

    // Add the new task
    tasks.push(newTask);
    return res.status(HttpStatus.CREATED).json(newTask);
});
