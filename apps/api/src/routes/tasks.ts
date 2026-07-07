/**
 * Holds all routes that act on task related endpoints
 */

import { TaskCreationSchema, Task, Status, HttpStatus } from "../types.js";
import  Router, { type Request, type Response } from 'express';

// TODO(#2): Database needs to handle ID
let currentId = 2;
// TODO(#2) Move to database
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
taskRouter.post("/tasks", (req: Request, res: Response) => {
    // Verify the incoming task has all correct types and fields
    const result = TaskCreationSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({errors: result.error.issues});
    }

    const newTask = {
        id: ++currentId,
        title: req.body.title,
        status: req.body.status
    }

    // Add the new task
    tasks.push(newTask);
    return res.status(HttpStatus.OK).json(newTask);
});
