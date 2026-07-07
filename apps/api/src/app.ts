/**
 * Contains the definition of the web server and adds any configuration settings needed
 */

import express, { type Application } from 'express';
import { taskRouter } from './routes/tasks.js';

// Create the app
export const app: Application = express();

// Add any configurations
app.use(express.json());

// Add all routes
app.use(taskRouter);
