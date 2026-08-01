import { HttpStatus } from "../types.js";
import { type Request, type Response } from 'express';
import { pool } from '../db/pool.js';

/**
 * Queries the database for all current tasks
 * @param req the incoming request
 * @param res a response object to send
 * @returns a response object containing an array of all task objects, or containing an error message
 */
export async function getAllTasks(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT *
        FROM tasks
        ORDER BY id ASC
      `);

      return res.status(HttpStatus.OK).json(result.rows);
    } catch (error) {
      console.error("Failed to load tasks:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error - failed to load tasks"});
    }
}

/**
 * Queries the database for the task based on the ID parameter
 * @param req the incoming request
 * @param res a response object to send
 * @returns the task object matching the ID, or a response object of 404
 */
export async function getTask(req: Request, res: Response) {
    const id = req.params.id;

    try {
        const result = await pool.query(
            `
            SELECT * FROM tasks
            WHERE id = $1 AND project_id IN (
              SELECT ID
              FROM projects
              WHERE owner_id = $2
              )
            `,
            [id, req.user!.userId]
        );

        if (result.rowCount === 0) {
            return res.status(HttpStatus.NOT_FOUND).json({error : `Task with id ${req.params.id} was not found.`});
        }

        return res.status(HttpStatus.OK).json(result.rows[0]);
    } catch (error) {
        console.error(`Error retrieving task: ${error}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error : "Failed to retrieve item."});
    }
}

/**
 * Creates a new task in the database
 * @param req the incoming request
 * @param res a response object to send
 * @returns the newly created task or an error message
 */
export async function createTask(req: Request, res: Response) {
    const title = req.body.title;
    const description = req.body.description;
    const project_id = req.body.project_id;
    const assigned_to = req.body.assigned_to;
    const status = req.body.status;

    try {
      const result = await pool.query(
        `
          INSERT INTO tasks (title, description, project_id, assigned_to, status)
          VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [title, description, project_id, assigned_to, status]
      );

      return res.status(HttpStatus.CREATED).json(result.rows[0]);
    } catch (error) {
      console.error("Failed to add item:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error"});
    }
}

/**
 * Updates a current task in the database
 * @param req the incoming request
 * @param res a response object to send
 * @returns a response object containing the updated task object, or a 404 NOT_FOUND response
 */
export async function updateTask(req: Request, res: Response) {
    const id = Number(req.params.id);
    const title = req.body.title ?? null;
    const description = req.body.description;
    const project_id = req.body.project_id;
    const assigned_to = req.body.assigned_to;
    const status = req.body.status ?? null;
    try {
      const result = await pool.query(
        `
        UPDATE tasks
        SET title = COALESCE($2, title), description = COALESCE($3, description), project_id = COALESCE($4, project_id), assigned_to = COALESCE($5, assigned_to), status = COALESCE($6, status), updated_at = NOW()
        WHERE id = $1 AND project_id IN (
          SELECT ID
          FROM projects
          WHERE owner_id = $7
        )
        RETURNING *
        `,
        [id, title, description, project_id, assigned_to, status, req.user!.userId]
      );

      if (result.rowCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({ error: "Item could not be located" });
      }

      return res.status(HttpStatus.OK).json(result.rows[0]);
    } catch (error) {
      console.error("Failed to update item: ", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error - failed to update item."});
    }
}

/**
 * Deletes the task based on the ID parameter
 * @param req the incoming request
 * @param res a response object to send
 * @returns a 204 status or an object containing an error message on failure
 */
export async function deleteTask(req: Request, res: Response) {
    const id = Number(req.params.id);
    try {
      const result = await pool.query(
        `
        DELETE FROM tasks
        WHERE id = $1 AND project_id IN (
              SELECT ID
              FROM projects
              WHERE owner_id = $2
              )
        RETURNING *
        `,
        [id, req.user!.userId]
      );

      if (result.rowCount === 0) {
        return res.status(HttpStatus.NOT_FOUND).json({error: "Item could not be located."});
      }

      return res.sendStatus(HttpStatus.NO_CONTENT);
    } catch (error) {
      console.error("Failed to delete item: ", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error - Failed to delete item."});
    }
}
