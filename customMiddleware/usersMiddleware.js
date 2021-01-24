const usersService = require("../models/usersModel");
const bcrypt = require("bcryptjs");

module.exports = {
  validateUser,
  validateUserChanges,
  validateUserId,
  validateWithPassword,
  verifyUserByToken,
};

function validateUser(req, res, next) {
  if (!req.body.username)
    res.status(400).json({ message: "must include a username" });
  else if (!req.body.password)
    res.status(400).json({ message: "must include a password" });
  else next();
}

function validateUserChanges(req, res, next) {
  if (Object.keys(req.body).length === 0)
    res
      .status(400)
      .json({ message: "must include username or password change" });
  else if (req.body.id)
    res.status(400).json({ message: "must not include id change" });
  else if (!req.body.username && !req.body.password)
    res
      .status(400)
      .json({ message: "must include username or password change" });
  else next();
}

async function validateUserId(req, res, next) {
  const { id } = req.params;

  try {
    const user = await usersService.findById(id);

    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: "user with that id does not exist" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: err.toString(), message: "something went wrong" });
  }
}

async function validateWithPassword(req, res, next) {
  const { username, password } = req.body;

  if (!password || !username) {
    res.status(400).json({ error: "Please provide a username and password" });
  }

  try {
    const user = await usersService.findByUsername(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: err.toString(), message: "something went wrong" });
  }
}

async function verifyUserByToken(req, res, next) {
  if (req.params.id && req.params.id == req.jwtToken.subject) {
    next();
  } else {
    res.status(401).json({ error: "user id and user token do not match" });
  }
}
