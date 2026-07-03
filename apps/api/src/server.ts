import { type Task, Status } from "./types.js"

const tasks: Task[] = [
    {id: 1, title: "Dummy Task 1", status: Status.IN_PROGRESS},
    {id: 2, title: "Dummy Task 2", status: Status.TODO}
];

for (const task of tasks) {
    console.log(JSON.stringify(task));
}
