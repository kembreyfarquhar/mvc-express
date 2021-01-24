// Import required dependencies and middleware
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

// Create Express Server
const server = express();

// Use middleware and JSON
server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(morgan("combined"));

// Import Routers
const usersRouter = require("./routes/usersRoutes");

// Use Routers
server.use("/api/users", usersRouter);

// Sanity Check
server.get("/", (_req, res) => {
  res.send(
    '<h1>Welcome to MVC Express API!</h1><h3>For documentation <a href="https://github.com/kembreyfarquhar/mvc-express">click here</a>.</h3><p>This API was made by <a href="https://github.com/kembreyfarquhar">Katie Embrey-Farquhar</a> with ❤️</p>'
  );
});

// Create PORT #
const port = process.env.PORT || 4000;

// Listen on given PORT
server.listen(port, () => console.log(`\n**** RUNNING ON PORT ${port} ****\n`));
