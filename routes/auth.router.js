const express = require("express")
const router = express.Router()
const authController = require("../controllers/auth.controller")
const { checkUser, checkLoggedIn } = require("../middlewares/auth.middleware")
router.post("/signup", checkLoggedIn, authController.signUp)
router.post("/signin", checkLoggedIn, authController.signIn)
router.post("/signout", authController.signOut)
module.exports = router