import { type Task, Status } from "./types.js";
import express, { type Application, type Request, type Response } from 'express';
import 'dotenv/config';

// Read in environment variables
const PORT = Number(process.env.PORT ?? 3000);
const dbUrl = process.env.DATABASE_URL || "";
const jwToken = process.env.JWT_SECRET || "";


// TODO(#2) Move to database
const tasks: Task[] = [
    {id: 1, title: "Dummy Task 1", status: Status.IN_PROGRESS},
    {id: 2, title: "Dummy Task 2", status: Status.TODO}
];

const app = express();
app.use(express.json());

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
