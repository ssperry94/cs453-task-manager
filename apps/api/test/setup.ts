import { pool } from "../src/db/pool.js";
import { beforeEach } from "vitest";

// Reset all tables and re-seed the database based on values in schema.test.sql
beforeEach(async () => {
    await pool.query(
        `
        TRUNCATE TABLE tasks, projects, users
        RESTART IDENTITY
        CASCADE
        `
    );

    await pool.query(
        `
        INSERT INTO users (name, email, password_hash, role)
        VALUES (
            'Dummy User',
            'dummy@example.com',
            '$2b$10$QYc.barIqrDHWUiCqutB/uI2mUIW3fCk7EFh61ml0F4vFaqjOZ72i',
            'user'
        );

        INSERT INTO projects (name, description, owner_id)
        VALUES (
            'Dummy Project',
            'Project used for development testing.',
            1
        );

        INSERT INTO tasks (title, description, project_id, assigned_to, status)
        VALUES (
            'Dummy Task',
            'Task used for development testing.',
            1,
            1,
            'todo'
        );
        `
    );
});
