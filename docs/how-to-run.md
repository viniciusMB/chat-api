# Running the Project

Before you begin, ensure you have Node.js, npm, and Docker installed.

In the project root (where the `docker-compose.yml` file is located), run:

```bash
docker-compose up --build
```

This command builds and starts all the services (MongoDB, RabbitMQ, LocalStack, and the NestJS app). Once everything is up, access the application at [http://localhost:3000](http://localhost:3000).

> **Disclaimer:**  
> The generated file download URLs reference the Docker container's host. To download files from your local machine, change the host in the URL to `localhost`.

You can access MongoDB at the following URI:

```
mongodb://root:example@localhost:27017/nestjs?authSource=admin
```

To interact with the chat API, use the collection at: `./collection/messages-har-collection.har`

For testing, install the dependencies first:

```bash
npm install
```

Then, run the tests:

- **Unit Tests:**  
  ```bash
  npm run test
  ```
- **Integration Tests:**  
  ```bash
  npm run test:e2e
  ```

That's it! Enjoy exploring the project.