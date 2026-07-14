/**
 * Contains automated unit tests for the task routes
 */

import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { HttpStatus, Status } from "../src/types.js";

describe("Unit testing for task routes", () => {
    test("GET /tasks returns status OK", async () => {
        const app = createApp();
        await request(app).get("/tasks").expect(HttpStatus.OK);
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
    })
});
