/**
 * Holds the object representation of a task
*/

import * as z from 'zod';

export const Status = {
    TODO: "todo",
    DONE: "done",
    IN_PROGRESS: "in-progress",
    WONT_DO: "wont-do"
} as const;

export type Status = typeof Status[keyof typeof Status];

// Schema's
export const StatusSchema = z.enum([
    Status.TODO,
    Status.DONE,
    Status.IN_PROGRESS,
    Status.WONT_DO
]);

export const TaskSchema = z.object({
    id: z.number(),
    title: z.string(),
    status: StatusSchema
});

export const TaskCreationSchema = TaskSchema.omit({id: true});

// Infer types from Zod Schema's
export type Task = z.infer<typeof TaskSchema>;
export type TaskCreation = z.infer<typeof TaskCreationSchema>;

// export interface Task {
//     id: number,
//     title: string,
//     status: Status
// };

export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = typeof HttpStatus[keyof typeof HttpStatus];