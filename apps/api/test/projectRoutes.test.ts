/**
 * Contains automated unit tests for the project routes
 */

import { beforeAll, describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { HttpStatus } from "../src/types.js";
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

describe("Unit testing for project routes", () => {
    test("GET /projects returns status OK", async () => {
        const app = createApp();

        await request(app)
            .get("/projects")
            .set("Authorization", `Bearer ${adminToken}`)
            .expect(HttpStatus.OK);
    });

    test("GET /projects returns unauthorized with no token present", async () => {
        const app = createApp();

        await request(app)
            .get("/projects")
            .expect(HttpStatus.UNAUTHORIZED);        
    });

    test("GET /projects/:id returns status OK", async () => {
        const app = createApp();

        await request(app)
            .get("/projects/1")
            .set("Authorization", `Bearer ${testToken}`)
            .expect(HttpStatus.OK);
    });

    test("GET /projects/:id returns unauthorized with no token present", async () => {
        const app = createApp();

        await request(app)
            .get("/projects/1")
            .expect(HttpStatus.UNAUTHORIZED);   
    });

    test("GET /projects/:id returns NOT_FOUND on project that doesn't exist", async () => {
        const app = createApp();

        await request(app)
            .get("/projects/9999")
            .set("Authorization", `Bearer ${testToken}`)
            .expect(HttpStatus.NOT_FOUND);
    });

    test("POST /projects adds new project correctly", async () => {
        const app = createApp();

        const res = await request(app)
            .post("/projects")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${testToken}`)
            .send({
                name: "Test Project",
                description: "Test Description",
            })
            .expect(HttpStatus.CREATED);

        // Verify the new project was returned in the response body
        expect(res.body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: "Test Project",
                description: "Test Description",
                owner_id: 1
            })
        );
    });

    test("POST /projects returns unauthorized with no token present", async () => {
        const app = createApp();

        const res = await request(app)
            .post("/projects")
            .set("Accept", "application/json")
            .send({
                name: "Test Project",
                description: "Test Description",
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    test("POST /projects correctly returns BAD REQUEST on missing field", async () => {
        const app = createApp();

        await request(app)
            .post("/projects")
            .set("Accept", "application/json")
            .set("Authorization", `Bearer ${testToken}`)
            .send({
                description: "Project missing its required name.",
            })
            .expect(HttpStatus.BAD_REQUEST);
    });
});
