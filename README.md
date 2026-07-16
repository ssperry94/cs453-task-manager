
# CS453/553 Client-Server Architecture Project

## About
This is a simple task manager system in which users can provide a task title and status and commit it to a database. This project is meant to demonstrate basic API structure, database activity, and other client-server architecture.

Both the development database and the test database create a task table and initialize a starter task on container startup.

## Requirements
- Node v24.16.0+
- Docker v29.6.1+

## Setting up the env file
From within the `apps/api` directory, create a `.env` file with the following default values:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cs453
PORT=3000
```
**You must create this file with at least the `DATABASE_URL` or the server will not be able to connect with the database!!**

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

3) Bring up the development database
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

## How to Manually Fire the Endpoints
Ensure that you have followed the above steps to properly run the server. There are 6 endpoints to fire. The table below provides the URI and curl commands to test each endpoint's happy path.

| Endpoint | Curl Command |
| -------- | ------------ |
| GET /tasks | `curl http://localhost:3000/tasks` |
| GET /tasks/{id} | `curl http://localhost:3000/tasks/1` |
| POST /tasks | `curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Dummy Task","status":"todo"}'` |
| PATCH /tasks/{id} | `curl -X PATCH http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"title":"Updated Task","status":"done"}'` |
| DELETE /tasks/{id} | `curl -X DELETE http://localhost:3000/tasks/1` |
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

## License

This repository is provided for educational use in CS453/553.
