/**
 * Contains automated unit tests for the task routes
 */

import { beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { HttpStatus, Status } from "../src/types.js";
import jwt from 'jsonwebtoken';
import { config, jwtExpiresIn } from "../src/constants.js";

// Generate a JWT token so requests can be successfully executed
let testToken : string;
let adminToken : string

beforeAll(() => {
  testToken = jwt.sign(
    {
      userId: 1,
      name: "Dummy User",
      email: "dummy@example.com",
      role: "user"
    },
    config.JWT_SECRET,
    { expiresIn: jwtExpiresIn }
  );

  adminToken = jwt.sign(
    {
        userId: 2,
        name: "admin",
        email: "admin@example.com",
        role: "admin"
    },
    config.JWT_SECRET,
    { expiresIn: jwtExpiresIn }
  );
});

describe("Unit testing for task routes", () => {
    test("GET /tasks returns status OK", async () => {
        const app = createApp();

        await request(app)
            .get("/tasks")
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(HttpStatus.OK);
    });

    test("GET /tasks returns unauthorized with no token present", async () => {
        const app = createApp();

        await request(app)
            .get("/tasks")
            .expect(HttpStatus.UNAUTHORIZED);        
    });

    test("GET /tasks returns Unauthorized without an admin token", async () => {
        const app = createApp();

        await request(app)
            .get("/tasks")
            .set("Authorization", `Bearer ${testToken}`)
            .expect(HttpStatus.FORBIDDEN);
    });    

    test("GET /tasks/:id returns status OK", async () => {
        const app = createApp();

        await request(app)
            .get("/tasks/1")
            .set("Authorization", `Bearer ${testToken}`)
            .expect(HttpStatus.OK);
    });

    test("GET /tasks/:id returns unauthorized with no token present", async () => {
        const app = createApp();

        await request(app)
            .get("/tasks/1")
            .expect(HttpStatus.UNAUTHORIZED);   
    });

    test("GET /tasks/:id returns NOT_FOUND on task that doesn't exist", async () => {
        const app = createApp();

        await request(app)
            .get("/tasks/9999")
            .set("Authorization", `Bearer ${testToken}`)
            .expect(HttpStatus.NOT_FOUND);
    });

    test("POST /tasks adds new task correctly", async () => {
        const app = createApp();

        const res = await request(app)
            .post("/tasks")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${testToken}`)
            .send({
                title: "Test Task",
                description: "Task created during automated testing.",
                project_id: 1,
                assigned_to: 1,
                status: Status.TODO
            })
            .expect(HttpStatus.CREATED);

        // Verify the new task was returned in the response body
        expect(res.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                title: "Test Task",
                description: "Task created during automated testing.",
                project_id: 1,
                assigned_to:1,
                status: Status.TODO
            })
        );
    });

    test("POST /tasks returns unauthorized with no token present", async () => {
        const app = createApp();

        const res = await request(app)
            .post("/tasks")
            .set("Accept", "application/json")
            .send({
                title: "Test Task",
                description: "Task created during automated testing.",
                project_id: 1,
                assigned_to: 1,
                status: Status.TODO
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    test("POST /tasks correctly returns BAD REQUEST on missing field", async () => {
        const app = createApp();

        await request(app)
            .post("/tasks")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${testToken}`)
            .send({
                description: "Task missing its required title.",
                project_id: 1,
                status: Status.TODO
            })
            .expect(HttpStatus.BAD_REQUEST);
    });

    test("PATCH /tasks/:id correctly updates the proper fields.", async () => {
        const app = createApp();

        // Get the task with an id of 1
        const expectedResponse = await request(app)
            .get("/tasks/1")
            .set("Authorization", `Bearer ${testToken}`)
            .expect(HttpStatus.OK);

        const res = await request(app)
            .patch("/tasks/1")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${testToken}`)
            .send({
                status: Status.WONT_DO
            })
            .expect(HttpStatus.OK);

        // Assert that the status was updated
        expect(res.body.status).not.toBe(expectedResponse.body.status);
        expect(res.body.status).toBe(Status.WONT_DO);
    });

    test("PATCH /tasks/:id returns unauthorized with no token present", async () => {
        const app = createApp();

        await request(app)
            .patch("/tasks/1")
            .set("Accept", "application/json")
            .send({
                description: "Task missing its required title.",
                project_id: 1,
                status: Status.TODO
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    test("PATCH /tasks/:id returns BAD REQUEST if no fields are present.", async () => {
        const app = createApp();

        await request(app)
            .patch("/tasks/1")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${testToken}`)
            .send({})
            .expect(HttpStatus.BAD_REQUEST);
    });

    test("DELETE /tasks/:id deletes the task and returns 204.", async () => {
        const app = createApp();

        // Get the first task
        const toBeDeleted = await request(app)
            .get("/tasks/1")
            .set("Authorization", `Bearer ${testToken}`)
            .expect(HttpStatus.OK);

        await request(app)
            .delete("/tasks/1")
            .set("Authorization", `Bearer ${testToken}`)
            .expect(HttpStatus.NO_CONTENT);

        // Confirm the task was deleted
        const tasks = await request(app)
            .get("/tasks")
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(HttpStatus.OK);

        expect(tasks.body).not.toContainEqual(toBeDeleted.body);
    });

    test("DELETE /tasks/:id returns unauthorized with no token present.", async () => {
        const app = createApp();

        await request(app)
            .delete("/tasks/1")
            .expect(HttpStatus.UNAUTHORIZED);
    });

    test("DELETE /tasks/:id returns forbidden if a user tries to delete a task they don't own.", async () => {
        const app = createApp();

        // Make the admin create a project
        await request(app)
            .post("/projects")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                name: "Admin Project",
                description: "Admin Description",
            })
            .expect(HttpStatus.CREATED);

        // Now have the admin create a task
        await request(app)
            .post("/tasks")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                title: "Admin Task",
                description: "Admin Task created during automated testing.",
                project_id: 2,
                assigned_to: 2,
                status: Status.TODO
            })
            .expect(HttpStatus.CREATED);

        // The user should fail to delete this
        await request(app)
            .delete("/tasks/2")
            .set("Authorization", `Bearer ${testToken}`)
            .expect(HttpStatus.NOT_FOUND);  // we return NOT_FOUND because the user should have no other knowledge of tasks they don't own
    });
});
