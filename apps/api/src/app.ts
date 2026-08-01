/**
 * Contains the definition of the web server and adds any configuration settings needed
 */

import express, { type Application } from 'express';
import { taskRouter } from './routes/tasks.js';
import { healthRouter } from './routes/health.js';
import { userRouter } from './routes/users.js';
import { projectRouter } from './routes/projects.js';

/**
 * Creates an express application with the proper configurations and routers for the web server
 * @returns an fully configured express app object
 */
export function createApp() {
    // Create the app
    const app: Application = express();

    // Add any configurations
    app.use(express.json());

    // Add all routes
    app.use(taskRouter);
    app.use(healthRouter);
    app.use(userRouter);
    app.use(projectRouter);

    return app;
}
