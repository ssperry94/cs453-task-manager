import { TaskCreationSchema, Task, TaskCreation, Status, HttpStatus, TaskSchema } from "./types.js";
import express, { type Application, type Request, type Response } from 'express';
import 'dotenv/config';

// Read in environment variables
const PORT = Number(process.env.PORT ?? 3000);
const dbUrl = process.env.DATABASE_URL || "";
const jwToken = process.env.JWT_SECRET || "";

// TODO(#2): Database needs to handle ID
let currentId = 2;
// TODO(#2) Move to database
const tasks: Task[] = [
    {id: 1, title: "Dummy Task 1", status: Status.IN_PROGRESS},
    {id: 2, title: "Dummy Task 2", status: Status.TODO}
];

const app = express();
app.use(express.json());

/**
 * The /tasks get request
 */
app.get("/tasks", (req: Request, res: Response) => {
    return res.status(HttpStatus.OK).json(tasks);
});

app.post("/tasks", (req: Request, res: Response) => {
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

async function main() {
    //TODO(#2): Add db connection logic
    app.listen(PORT, () => {
        console.log(`Connected to server on port: ${PORT}`);
    });
}

main().catch((err) => {
    console.error("Error starting server: ", err);
    process.exit(1);
});
