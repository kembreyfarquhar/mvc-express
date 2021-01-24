const router = require("express").Router();
const usersController = require("../controllers/usersController");
const validator = require("../customMiddleware/usersMiddleware");
const restricted = require("../customMiddleware/restricted");

// ROUTES THAT USE THE CONTROLLER METHODS
router.get("/", restricted, usersController.find);
router.get("/:id", usersController.findById);
router.post("/register", validator.validateUser, usersController.register);
router.post("/login", validator.validateWithPassword, usersController.login);
router.put("/:id", validator.validateUserChanges, usersController.update);
router.delete("/:id", usersController.delete);

module.exports = router;
