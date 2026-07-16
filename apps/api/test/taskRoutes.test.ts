/**
 * Contains automated unit tests for the task routes
 */

import { beforeEach, describe, expect, test } from "vitest";
import { pool } from "../src/db/pool.js";
import request from "supertest";
import { createApp } from "../src/app.js";
import { HttpStatus, Status } from "../src/types.js";

// Reset the database state after each test, so any data currently in the database will be lost
beforeEach(async () => {
    await pool.query(
        `
        TRUNCATE TABLE tasks
        RESTART IDENTITY
        CASCADE
        `
    );

    await pool.query(
        `
        INSERT INTO tasks (title, status)
        VALUES ('Dummy Task', 'todo')
        `
    );
});

describe("Unit testing for task routes", () => {
    test("GET /tasks returns status OK", async () => {
        const app = createApp();
        await request(app).get("/tasks").expect(HttpStatus.OK);
    });

    test("GET /tasks/:id returns status OK", async () => {
        const app = createApp();

        await request(app).get("/tasks/1").expect(HttpStatus.OK);

    });

    test("GET /tasks/:id returns NOT_FOUND on task that doesn't exist", async () => {
        const app = createApp();

        await request(app).get("/tasks/9999").expect(HttpStatus.NOT_FOUND);
    });

    test("POST /tasks adds new task correctly", async () => {
        const app = createApp();

        const res = await request(app).post("/tasks").set("Accept", "application/json").send({
            title: "Test Task",
            status: Status.TODO
        }).expect(HttpStatus.CREATED);

        // Verify the new task was returned in the request body
        expect(res.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: "Test Task",
            status: Status.TODO
        }));
    });

    test("POST /tasks correctly returns BAD REQUEST on missing field", async () => {
        const app = createApp();

        await request(app).post("/tasks").set("Accept", "application/json").send({
            status: Status.TODO
        }).expect(HttpStatus.BAD_REQUEST);
    });

    test("PATCH /tasks/:id correctly updates the proper fields.", async () => {
        const app = createApp();

        // Get the item with id of 1
        const expectedResponse = await request(app).get("/tasks/1").expect(HttpStatus.OK);

        const res = await request(app).patch("/tasks/1").set("Accept", "application/json").send({
            status: Status.WONT_DO
        }).expect(HttpStatus.OK);

        // Assert that we actually updated the status
        expect(res.body.status).not.toBe(expectedResponse.body.status);
        expect(res.body.status).toBe(Status.WONT_DO);

    });

    test("PATCH /tasks/:id returns BAD REQUEST if no fields are present.", async () => {
        const app = createApp();

        await request(app).patch("/tasks/1").set("Accept", "application/json").send({}).expect(HttpStatus.BAD_REQUEST);
    });

    test("DELETE /tasks/:id deletes the task and returns 204.", async () => {
        const app = createApp();

        // Get the first task
        const toBeDeleted = await request(app).get("/tasks/1").expect(HttpStatus.OK);

        await request(app).delete("/tasks/1").expect(HttpStatus.NO_CONTENT);

        // Confirm the item is deleted
        const tasks = await request(app).get("/tasks");

        expect(tasks.body).not.toContain(toBeDeleted.body);
    });
});
