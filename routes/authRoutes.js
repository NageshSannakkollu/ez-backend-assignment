const express = require("express")
const router = express.Router()
const userController = require("../controllers/authController")

router.post("/signup",userController.registerUser)
router.post("/login",userController.loginUser)
router.post("/emailverification/",userController.verifyEmailAddress)

module.exports = router;