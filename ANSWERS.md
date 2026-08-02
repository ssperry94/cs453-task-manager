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


# Sam Perry Checkpoint 2 Reflection Answers

1) What is the difference between authentication and authorization?

    - Authentication validates if the incoming user has login credentials to access the server. It validates that a user is registerd in the system, and often provides a role for the user that then dictates what they are authorized to access. Authorization is the process by which the server regulates the actions of an authenticated user. It provides the rules that dictate what resources the user can access, and what actions it can take on those resources.

2) Why should passwords be hashed instead of stored directly?

    - Passwords should be stored in their hashed form rather than stored as plain text because they are more secure hashed than in plain text. If an attacker steals a hashed password, it cannot be easily decrypted since hashing algorithms used are one-way. If a user steals a password in plain-text, then they now posses the actual password in usable form. If the password is hashed, it cannot be directly used to break into a system.

3) What information did you include in your JWT, and why?

    - A JWT should a header, the JWT secret, and an expiration time. The JWT header contains all user information needed to verify the user and enforce authorization and ownership rules. The JWT secret is used to verify that the token was administered by the server. The expiration time is included to ensure that old tokens cannot be used to gain unauthorized access and rotate out tokens.

4) What is the difference between a 401 response and a 403 response?

    - A 401 UNAUTHORIZED response is the response an API gives when a user cannot be authenticated. This means that the user does not posses the correct credentials to access the server. A 403 Forbidden response indicates that an authenticated user attempted to access a resource or perform an action without the correct permissions. 401 indicates improper authentication, while a 403 indicates improper authorization.

5) Where does your application perform role or ownership checks?

    - My application performs role checks in the `GET /tasks` and `GET /projects` routes to enforce that only administrators can see all tasks and projects. My application performs ownership checks in all direct project/task actions to ensure that only the owner of the resource may act up them.

6) How are users, projects, and tasks related in your database?

    - User, projects, and tasks are implemented into their own tables. Each user can own a project, and tasks are assigned to a project. Tasks can be assigned to different users, but not moved to projects in which that user does not own.

7) What was the hardest part of adding authentication or authorization?

    - The most difficult part of adding authentication/authorization was deciding the rules by which users could interact with tasks and projects. There are many different scenarios in which a user could access a project they don't own through a task. Accounting for and finding a clean solution to these cases proved to be a challenging but rewarding task. 