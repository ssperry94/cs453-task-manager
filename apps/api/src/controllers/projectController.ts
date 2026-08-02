import { HttpStatus } from "../types.js";
import { type Request, type Response } from 'express';
import { pool } from '../db/pool.js';

/**
 * Returns all projects present in the database
 * 
 * @param req the incoming request
 * @param res the outgoing response containing all projects
 * @returns a response containing all projects in the database
 */
export async function getAllProjects(req: Request, res: Response) {
    try {
      const result = await pool.query(`
        SELECT *
        FROM projects
        ORDER BY id ASC
      `);

      return res.status(HttpStatus.OK).json(result.rows);
    } catch (error) {
      console.error("Failed to load projects", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error - failed to load tasks"});
    }
}

/**
 * Returns the project specified by the ID, or NOT_FOUND if the project cannot be found.
 * 
 * @param req the incoming request
 * @param res the outgoing response
 * @returns a response containing the project by ID, or an error message 
 */
export async function getProject(req: Request, res: Response) {
    const id = req.params.id;

    try {
        const result = await pool.query(
            `
            SELECT * FROM projects
            WHERE id = $1 AND owner_id = $2
            `,
            [id, req.user!.userId]
        );

        if (result.rowCount === 0) {
            return res.status(HttpStatus.NOT_FOUND).json({error : `Project with id ${req.params.id} was not found.`});
        }

        return res.status(HttpStatus.OK).json(result.rows[0]);
    } catch (error) {
        console.error(`Error retrieving project: ${error}`);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error : "Failed to retrieve project."});
    }
}

/**
 * Creates a new project to be stored in the database
 * 
 * @param req the incoming request
 * @param res the outgoing response
 * @returns a response containing the newly created project, or an error message
 */
export async function createProject(req: Request, res: Response) {
    const name = req.body.name;
    const description = req.body.description;
    const owner_id = req.user?.userId;  // assign the current user's id to the project

    // If we somehow don't have an ID, our request has not been authenticated somehow
    if (!owner_id) {
        console.error("Request was made without authentication.");
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error."});
    }

    try {
      const result = await pool.query(
        `
        INSERT INTO projects (name, description, owner_id)
        VALUES ($1, $2, $3)
        RETURNING *
        `,
        [name, description, owner_id]
      );

      return res.status(HttpStatus.CREATED).json(result.rows[0]);
    } catch (error) {
      console.error("Failed to add project:", error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({error: "Internal Server Error"});
    }
}
