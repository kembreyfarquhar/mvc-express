const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(morgan("combined"));

const usersRouter = require("./routes/usersRoutes");

server.use("/api/users", usersRouter);

server.get("/", (_req, res) => {
  res.send(
    '<h1>Welcome to the CharterAdmin API!</h1><h3>For documentation <a href="https://github.com/kembreyfarquhar/CharterAdmin/tree/main/backend/README.md">click here</a>.</h3><p>This API was made by <a href="https://github.com/kembreyfarquhar">Katie Embrey-Farquhar</a> with ❤️</p>'
  );
});

const port = process.env.PORT || 4000;
server.listen(port, () => console.log(`\n**** RUNNING ON PORT ${port} ****\n`));
