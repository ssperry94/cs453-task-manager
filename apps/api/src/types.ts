/**
 * Holds the various types used in the server
*/

import * as z from 'zod';

// The status enum indicates the project of the task on the board
export const Status = {
    TODO: "todo",
    DONE: "done",
    IN_PROGRESS: "in-progress",
    WONT_DO: "wont-do"
} as const;

export type Status = typeof Status[keyof typeof Status];

// Schema's

// Schema for validating an ID when it is part of a URL's parameters
export const IdSchema = z.object({
    id: z.coerce.number().positive().int()  
});

// A schema representing the status enum. Enforces only valid values used in new tasks
export const StatusSchema = z.enum([
    Status.TODO,
    Status.DONE,
    Status.IN_PROGRESS,
    Status.WONT_DO
]);

// Outlines all required fields of the Task type
export const TaskSchema = z.object({
    id: z.number(),
    title: z.string(),
    status: StatusSchema
});

// Schema for creating tasks - allows all values outlined in the task schema except for id (set internally)
export const TaskCreationSchema = TaskSchema.omit({id: true});
export const TaskUpdateSchema = TaskCreationSchema.partial().refine(
    data => Object.keys(data).length > 0,
    {error: "At least one field required."}
);

// Infer types from Zod Schema's
export type Task = z.infer<typeof TaskSchema>;
export type TaskCreation = z.infer<typeof TaskCreationSchema>;

// Enum representing common HttpStatuses
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = typeof HttpStatus[keyof typeof HttpStatus];
