const Router = require("express");
const userController = require("../controllers/user-controller");
const validationMiddleware = require("../middleware/validation");
const router = new Router();

router.post(
    "/users",
    validationMiddleware.validateUser,
    userController.createUser
);
router.get("/users/:id", userController.getUser);
router.post("/login", userController.login);
router.put(
    "/users/:id",
    validationMiddleware.validateUserUpdates,
    userController.updateUser
);

module.exports = router;
