/**
 * Defines various constants used throughout
 */

import { ConfigSchema} from "./types.js";
import "dotenv/config"

export const BCRYPT_COST = 10;
export const config = ConfigSchema.parse(process.env);
