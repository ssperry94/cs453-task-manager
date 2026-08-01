/**
 * Defines various constants used throughout
 */

import { ConfigSchema } from "./types.js";
import "dotenv/config"

export const BCRYPT_COST = 10;
export const jwtExpiresIn = "1h";
export const config = ConfigSchema.parse(process.env);
export const CHECK_TASK_PROJECT_RELATIONSHIP = `
AND project_id IN (
          SELECT ID
          FROM projects
          WHERE owner_id = 
`
