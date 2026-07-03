/**
 * Holds the object representation of a task
*/

export const Status = {
    TODO: "todo",
    DONE: "done",
    IN_PROGRESS: "in-progress",
    WONT_DO: "wont-do"
} as const;

export type Status = typeof Status[keyof typeof Status];

export interface Task {
    id: number,
    title: string,
    status: Status
};
