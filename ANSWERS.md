# Sam Perry Checkpoint 1 Reflection Answers

1) What is the difference between an in-memory API and a database-backed API?
    - An in-memory API is an API who's entire resource infrastructure only exists in memory. This means that data is not persistent between server restarts. A database-back API means that all required data for the API lives in some kind of database. This means that the data is persistent on server restart, and that the API must now query the database for required data.

2) Why is it useful to separate routes, services, and database logic?
    - By separating routes, services, and database logic, we make our code more scalable and modular. As an API grows, if all components are too tightly coupled, it will be come harder and harder to add new features to it. If we separate out the components and decouple their logic, we can easily modify only the parts we need without worrying about refactoring the entire API.

3) What HTTP status codes did you use, and why?
    - I used all of the following HTTP status codes (take from the enum in `apps/api/types.ts`):
    ```typescript
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    ```

    I used the OK status (200) each time a request was successful and the response contained a body. I used the CREATED status (201) in the POST request when a new task was created. I used NO CONTENT (204) when a task was successfully deleted because that response does not contain a body. I used BAD REQUEST (400) whenever my middleware detected issues with the client's request. I used NOT FOUND (404) when the resource requested was not present in the database. Lastly, I used INTERNAL SERVER ERROR (500) when the server throws an exceptions or runs into some kind of unrecoverable error.

4) What happens when a client requests a task ID that does not exist?
    - When a client requests a task ID that does not exist, the server will search the database for that ID. When it does not find the ID, the server will return a response with a status code 404 (NOT FOUND) and a body containing an error message letting the client know that the resource could not be located.

5) What was the hardest part of connecting the API to PostgreSQL?
    - The most challenging part of connecting the API to the database was creating the separate docker-compose for testing the API. I did not want to pollute the main database, so I researched methods instead on how to properly create automated API tests. Mocking API calls seemed difficult, but creating a second docker compose seemed viable. So I created the `docker-compose-test-db.yml` based on the original. I then updated the test to use the URL for this database, rather than the development one. I then realized that I was running into test failures without resetting the database between tests. So, I created a beforeEach method that reset the test database back to its original values.