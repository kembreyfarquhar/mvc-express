// Create an Express Router
const router = require("express").Router();

// Import Controller
const usersController = require("../controllers/usersController");

// Import Custom Middleware
const validator = require("../customMiddleware/usersMiddleware");
const restricted = require("../customMiddleware/restricted");

// ROUTES THAT USE THE CONTROLLER METHODS
router.post("/register", validator.validateUser, usersController.register);
router.post("/login", validator.validateWithPassword, usersController.login);
router.get("/", restricted, usersController.find);
router.get(
  "/:id",
  restricted,
  validator.validateUserId,
  usersController.findById
);
router.put(
  "/:id",
  restricted,
  validator.validateUserChanges,
  validator.validateUserId,
  validator.verifyUserByToken,
  usersController.update
);
router.delete(
  "/:id",
  restricted,
  validator.validateUserId,
  validator.verifyUserByToken,
  usersController.delete
);

module.exports = router;
