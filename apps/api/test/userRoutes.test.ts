import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";
import { HttpStatus } from "../src/types.js";
import { jwtExpiresIn } from "../src/constants.js";

describe("Unit testing for user routes", () => {
    test("/auth/register successfully registers a new user", async () => {
        const app = createApp();

        await request(app)
            .post("/auth/register")
            .set("Accept", "application/json")
            .send({
                name: "Test User",
                email: "test@test.com",
                password_hash: "pwd"
            })
            .expect(HttpStatus.CREATED);
    });

    test("/auth/login successfully logins in valid user and returns JWT.", async () => {
        const app = createApp();

        const res = await request(app)
            .post("/auth/login")
            .set("Accept", "application/json")
            .send({
                email: "dummy@example.com",
                password_hash: "dummy_hash"
            })
            .expect(HttpStatus.OK);
        
        // Login should return token, bearer tag, and the user object
        expect(res.body).toEqual(
            expect.objectContaining({
                accessToken: expect.any(String),
                tokenType: "Bearer",
                expiresIn: jwtExpiresIn,
                user: expect.objectContaining({
                    id: expect.any(Number),
                    name: "Dummy User",
                    email: "dummy@example.com",
                    role: "user"
                })
            })
        );
    });

    test("/auth/login does not allow invalid email to log in", async () => {
        const app = createApp();

        await request(app)
            .post("/auth/login")
            .set("Accept", "application/json")
            .send({
                email: "bad_email@example.com",
                password_hash: "dummy_hash"
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    test("/auth/login does not allow invalid password to log in", async () => {
        const app = createApp();

        await request(app)
            .post("/auth/login")
            .set("Accept", "application/json")
            .send({
                email: "dummy@example.com",
                password_hash: "bad password"
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });
});
