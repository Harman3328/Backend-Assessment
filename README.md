# Backend Assessment

Framework - Express JS: 
  1. Simplicity and Minimalism: Express.js follows a minimalist approach, allowing developers to build web applications and APIs with ease.
  2. Routing: Express.js provides a robust and flexible routing mechanism. You can define routes for different HTTP methods and URLs, making it easy to handle various types of requests and organize your application's logic.
  3. Middleware: Express.js heavily relies on middleware functions, which are functions that can intercept and process incoming requests before they reach the final route handler. This middleware pattern allows developers to modularize and reuse code efficiently, enabling tasks such as authentication, logging, error handling, and more.
  4. Wide Adoption and Community Support: Express.js has been around for a long time and has gained massive adoption in the Node.js ecosystem. As a result, it has a large community of developers, extensive documentation, and numerous third-party packages (middleware and plugins) available for solving various problems.
  5. Flexibility: Express.js is unopinionated, meaning it doesn't impose a specific way of structuring your application. Developers have the freedom to choose how they want to organize their code and interact with other libraries or databases.
  6. Performance: Express.js is known for its fast performance and low overhead, making it an excellent choice for building high-performance applications and APIs.
  7. Middleware Ecosystem: As mentioned earlier, Express.js benefits from a vast middleware ecosystem. This means developers can leverage existing middleware for common functionalities like security, caching, compression, and more, saving time and effort in building these features from scratch.
  8. Integration with Other Libraries: Express.js seamlessly integrates with various other libraries and frameworks, making it easy to add functionalities such as templating engines, database connections, authentication strategies, and more.

Overall, Express.js is a great choice for developers who want a flexible and powerful framework to build web applications and APIs in Node.js. It strikes a good balance between simplicity and functionality, making it     suitable for projects of all sizes and complexities.

Database - Postgresql
  1. Advanced Features: PostgreSQL is known for its extensive set of advanced features, including support for complex data types (e.g., JSON, arrays), full-text search, common table expressions (CTEs), window functions, and much more. These features provide developers with powerful tools to handle diverse data scenarios.
  2. Robustness and Reliability: PostgreSQL is designed with a strong focus on data integrity and reliability. It supports ACID (Atomicity, Consistency, Isolation, Durability) transactions, ensuring that data remains consistent even in the face of failures, crashes, or concurrent operations.
  3. Scalability: PostgreSQL is capable of handling large-scale applications and databases. It can efficiently manage databases with millions or billions of records without sacrificing performance.
  4. Performance: PostgreSQL is optimized for performance and can handle complex queries and large datasets efficiently. It provides various indexing techniques and query optimization features to speed up data retrieval.
  5. Extensibility: PostgreSQL's extension system allows developers to create custom data types, functions, and procedural languages, extending the database's capabilities to suit specific application requirements.
  6. Community and Documentation: PostgreSQL has a large and active community of developers and users, which means there are abundant resources, tutorials, and support available. The official documentation is comprehensive and well-maintained.
  7. Open-Source and Free: PostgreSQL is an open-source software, which means it is free to use, modify, and distribute. This makes it a cost-effective choice for startups and businesses looking to minimize licensing costs.
  8. Cross-Platform Compatibility: PostgreSQL is available for various operating systems, including Linux, macOS, Windows, and more, providing flexibility for deploying applications on different platforms.
  9. Enterprise-Ready: PostgreSQL is widely adopted by enterprises and is considered a robust and mature solution. It is used by organizations of all sizes, from startups to large corporations, making it a reliable choice for critical applications.
  10. Support for Standards: PostgreSQL adheres to SQL standards and supports many SQL features, making it easier to migrate applications from other RDBMS platforms.

Overall, PostgreSQL is a versatile and feature-rich database management system suitable for a wide range of applications. It is an excellent choice for projects that require advanced data processing, reliability, and scalability.

3rd Party Tools:
  1. dotenv: a popular npm package used in Node.js applications to manage environment variables. It allows developers to store configuration settings and sensitive information, such as API keys, database credentials, and other configuration details, in a .env file. These variables are then read by the application using the process.env object, making it easy to access and use them throughout the application.
  2. express-rate-limit: an npm package used in Node.js applications, specifically with the Express.js framework, to implement rate limiting functionality. Rate limiting is a technique used to control the rate of incoming requests from a client to prevent abuse and protect the server from potential denial-of-service (DoS) attacks.
  3. jsonwebtoken is an npm package used in Node.js applications to generate, verify, and manage JSON Web Tokens (JWT). JWT is a compact, URL-safe, and self-contained token format that is widely used for securely transmitting information between parties as a JSON object. JWTs are commonly used for authentication and authorization in web applications and APIs.
  4. pg: an npm package that provides a PostgreSQL client for Node.js applications. It allows you to interact with a PostgreSQL database and execute SQL queries from your Node.js code. The pg package is widely used when you want to connect, read, and write data to a PostgreSQL database in your application.
  5. bcrypt: an npm package used in Node.js applications for hashing passwords securely. It is specifically designed to be slow and computationally intensive, making it more resistant to brute-force attacks. The purpose of bcrypt is to protect user passwords by converting them into irreversible hash values before storing them in a database. When users log in, their provided password is hashed and compared to the stored hash value to verify their identity.
  6. zxcvbn is a password strength estimation library developed by Dropbox. It is an npm package that can be used in Node.js applications to evaluate the strength of a password and provide feedback on its security. The library is designed to help users choose strong passwords and to assess the risk associated with the passwords they intend to use.
  7. supertest: an npm package used to test Node.js HTTP servers, particularly those built with web frameworks like Express.js. It allows you to make HTTP requests to your server and make assertions on the responses, simulating real client interactions with the server for testing purposes. With supertest, you can write automated tests to ensure that your server behaves correctly under different scenarios.
  8. body-parser: an npm package used in Node.js applications, particularly with web frameworks like Express.js, to parse the incoming request body data. It simplifies the process of extracting data from the request body, such as form data, JSON payloads, and URL-encoded data, and makes it accessible in a structured format for further processing.
  9. cookie-parser: an npm package used in Node.js applications, particularly with web frameworks like Express.js, to handle HTTP cookies. It parses the incoming request cookies and makes them accessible in a structured format, allowing you to read and manipulate cookies easily.
  10. axios is an npm package used in Node.js applications and modern web browsers to make HTTP requests to external resources, typically used to interact with APIs or fetch data from servers. It provides a simple and convenient interface for performing various types of HTTP requests, such as GET, POST, PUT, DELETE, etc.
  11. Jest: a popular testing framework and test runner for JavaScript applications, including Node.js applications and front-end applications. It is widely used for writing and running unit tests, integration tests, and snapshot tests. Jest is known for its simplicity, speed, and ease of use, making it a preferred choice for many developers when it comes to testing JavaScript code.
  12. nodemon: an npm package used to monitor and automatically restart Node.js applications whenever changes are detected in the source code. It is primarily used during development to improve the development workflow by eliminating the need to manually stop and restart the application after making code changes.

Instrucitons to run code with Docker:
  1. docker build -t backend .
  2. docker run -p 3001:3001 backend

Instructions to test code with Docker:
  1. docker build -t backend-test -f Dockerfile.test .
  2. docker run backend-test

Instructions to run in terminal: 
  1. npm install
  2. node index.js

Instructions to test in terminal:
  1. npm install
  2. npm test


