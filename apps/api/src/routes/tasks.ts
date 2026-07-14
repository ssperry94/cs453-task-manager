/**
 * Holds all routes that act on task related endpoints
 */

import { type Task, Status, HttpStatus } from "../types.js";
import  Router, { type Request, type Response } from 'express';
import { validateTask, validateTaskUpdate, validateId } from '../middleware/validation.js';

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
taskRouter.get("/tasks", async (req: Request, res: Response) => {
    return res.status(HttpStatus.OK).json(tasks);
});

/**
 * The /tasks/:id get request. Returns a specific task if found, otherwise 404
 */
taskRouter.get("/tasks/:id", validateId, async (req: Request, res: Response) => {
    const result = tasks.find((task) => {return task.id === Number(req.params.id)});

    if (result === undefined) {
        return res.status(404).json({error : `Task with id ${req.params.id} was not found.`});
    }

    return res.status(200).json(result);
});


/**
 * The /tasks post request. Adds a new task to the task database and sets the ID
 */
taskRouter.post("/tasks", validateTask, async (req: Request, res: Response) => {
    const newTask = {
        id: ++currentId,
        title: req.body.title,
        status: req.body.status
    }

    // Add the new task
    tasks.push(newTask);
    return res.status(HttpStatus.CREATED).json(newTask);
});
 
/**
 * The /tasks/:id PATCH request. Updates the send fields of the task. Returns 404 if not found. At least one required field must be present
 */
taskRouter.patch("/tasks/:id", validateId, validateTaskUpdate, async (req: Request, res: Response) => {
   const task = tasks.find(task => task.id === Number(req.params.id));

    if (task === undefined) {
        return res.status(404).json({error : `Task with the id ${req.params.id} was not found.`});
    }

    if (req.body.title !== undefined) {
        task.title = req.body.title;
    }

    if (req.body.status !== undefined) {
        task.status = req.body.status;
    }

    return res.status(200).json(task);
});

/**
 * Deletes a task. Returns 404 if the task is not found
 */
taskRouter.delete("/tasks/:id", validateId, async (req: Request, res: Response) => {
    const index = tasks.findIndex(task => task.id === Number(req.params.id));

    if (index < 0) {
      return res.status(404).json({
        error: `Task with id ${req.params.id} could not be found.`
      });
    }

    tasks.splice(index, 1);

    return res.sendStatus(HttpStatus.NO_CONTENT);
});
