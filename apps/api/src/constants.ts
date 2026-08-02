/**
 * Defines various constants used throughout
 */

import { ConfigSchema } from "./types.js";
import "dotenv/config"

export const BCRYPT_COST = 10;                                         // The cost to use when hashing a password
export const jwtExpiresIn = "1h";                                      // the time it takes for a JWT token to expire
export const config = ConfigSchema.parse(process.env);                 // A config object containing all environment variables
export const CHECK_TASK_PROJECT_RELATIONSHIP = `AND project_id IN (
          SELECT ID
          FROM projects
          WHERE owner_id = `                                           // SQL that validates that a user owns a project before acting on a task
