# CS453/553 Client-Server Architecture Project

## About
This is a simple task manager system in which users can provide a task title and status and commit it to a database. This project is meant to demonstrate basic API structure, database activity, authentication, and other client-server architecture.

Both the development database and the test database create a task table, project table, user table, a default user and admin account, and initialize a starter project and task upon container startup.

## Requirements
- Node v24.16.0+
- Docker v29.6.1+

## Setting up the env file
Before setting up the `.env` file, you'll need to generate a JWT secret to use an environment variable. The application will not behave correctly if you do not follow this step. To generate a compatible secret, run the following command:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

This will output a secret you can paste into the `JWT_SECRET` environment variable.

From within the `apps/api` directory, create a `.env` file with the following default values:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cs453
PORT=3000
JWT_SECRET=<your-token-here>
```
**You must create this file with at least the `DATABASE_URL` and the `JWT_SECRET` or the server will not function correctly!**

## How to Run
Ensure that you've followed the **Setting up the env file** steps above.

Run all of the following commands from the root directory:
1) Install the Dependencies
```bash
npm install
```

2) Build the project
```bash
npm run build
```

3) Bring up the development database. (NOTE all data is created upon startup)
```bash
docker compose -f docker-compose.yml up -d
```

4) Start the Server
```bash
npm run start
```

5) After stopping the server, bring down the development database with:
```bash
docker compose -f docker-compose.yml down -v
```

## Optional: How to Register
If you wish, you may choose to register your own user before testing the server. To do so, run the following curl command:
```bash
curl -X POST  http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"name":"<your-name>","email":"<your-email>","password_hash":"<your-password>"}'
```

Remember to replace the `name`, `email`, and `password_hash` fields with valid values.

Note that there is no method to create an admin account - the database is already seeded with a default account. Details to use the admin account below.

## How to Manually Fire the Endpoints
Ensure that you have followed the above required steps to properly run the server.

For most endpoints, you cannot fire them unless you have a token of some kind. In order to obtain a token, you'll need to login with one of the curl requests below:

To log in as the default user:
```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"dummy@example.com","password_hash":"dummy_hash"}'
```

To log in as the admin:
```bash
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password_hash":"admin"}'
```

Upon successful log in, you will get a return that looks similar to this:
```bash
{"accessToken":"your-token","tokenType":"Bearer","expiresIn":"1h","user":{"id":1,"name":"Dummy User","email":"dummy@example.com","role":"user"}}
```

The `accessToken` field contains your JWT token used in authentication. It is recommended to save the user token in an environment variable called `USRTOK` and the admin token in a variable called `ADMTOK` so that the curl commands listed below are easy to paste in.

```bash
export USRTOK=<paste-user-token>
export ADMTOK=<paste-admin-token>
```

There are 11 endpoints to fire. The table below provides the URI and curl commands to test each endpoint's happy path.

Please note:
- The `GET /tasks` and the `GET /projects` routes require the admin token (`ADMTOK`)
- These commands are assuming you've set the environment variables above. If you have not, you will need to replace the `$ADMTOK` and `$USRTOK` with their respective values.
- These endpoints are assuming you are using the default accounts. If you are using your own user, you will not be authorized to use most of these as-is and will need to create appropriate projects/tasks as that user first.

| Endpoint | Curl Command |
| -------- | ------------ |
| POST /auth/register | `curl -X POST http://localhost:3000/auth/register -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@example.com","password_hash":"joedoe123!"}'` |
| POST /auth/login | `curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"dummy@example.com","password_hash":"dummy_hash"}'` |
| GET /tasks | `curl http://localhost:3000/tasks -H "Authorization: Bearer $ADMTOK"` |
| GET /tasks/{id} | `curl http://localhost:3000/tasks/1 -H "Authorization: Bearer $USRTOK"` |
| POST /tasks | `curl -X POST http://localhost:3000/tasks -H "Authorization: Bearer $USRTOK" -H "Content-Type: application/json" -d '{"title":"Dummy Task","description":"This is a dummy task.","project_id":1,"assigned_to":1,"status":"todo"}'` |
| PATCH /tasks/{id} | `curl -X PATCH http://localhost:3000/tasks/1 -H "Authorization: Bearer $USRTOK" -H "Content-Type: application/json" -d '{"title":"Updated Task","description":"Updated description.","project_id":1,"assigned_to":1,"status":"done"}'` |
| DELETE /tasks/{id} | `curl -X DELETE http://localhost:3000/tasks/1 -H "Authorization: Bearer $USRTOK"` |
| GET /projects | `curl http://localhost:3000/projects -H "Authorization: Bearer $ADMTOK"` |
| GET /projects/{id} | `curl http://localhost:3000/projects/1 -H "Authorization: Bearer $USRTOK"` |
| POST /projects  | `curl -X POST http://localhost:3000/projects -H "Authorization: Bearer $USRTOK" -H "Content-Type: application/json" -d '{"name":"Dummy Project","description":"This is a dummy project."}'` |
| GET /health  | `curl http://localhost:3000/health` |

## How to run Automated Tests
In the `test/` directory, there are automated tests that exercise the endpoints against a test database. This test database is ran on port 5433 and is separate from the development database. To run the automated tests:

1) Stand up the Test Database
```bash
docker compose -f docker-compose-test-db.yml up -d
```

2) Run the Tests
```bash
npm run test
```

3) Bring down the Test Database
```bash
docker compose -f docker-compose-test-db.yml down -v
```

## About Authorization/Authentication
All project/task endpoints require some kind of authentication through a JWT. Most project and tasks do not allow anyone other than the admin access items beyond what the respective user owns. In order to protect other users resources, a `404 NOT_FOUND` is returned if a user tries to access a task/project they do not own.

- Users can only add tasks to a project they own
- Users can only delete tasks under a project they own
- Users can only view tasks/projects they created
- Users cannot create tasks/projects on behalf of another user
- Users can only delete tasks they own
- Admins have full rights to interact with all tasks/projects in any way

## License

This repository is provided for educational use in CS453/553.
