var express = require('express');
const User = require("../model/userModel");
const { createUserController, loginHandleController, getUserListController, forgetPasswordController, resetPasswordController } = require('../controller/userController');
const { validateTokenMiddleware } = require('../middleware/AuthMiddleware');
const { adminOnlyMiddleware } = require("../middleware/RoleMiddleware");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post("/create", createUserController);
router.post("/login", loginHandleController);
router.get("/list", validateTokenMiddleware, getUserListController);

// Forget password routes
router.post("/forgot-password", forgetPasswordController);

// reset password routes
router.get("/reset-password/:token", (req, res) => res.json({ message: "Reset password form", token: req.params.token }));
router.post("/reset-password/:token", resetPasswordController);


module.exports = router;
