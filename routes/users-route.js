const express = require("express")
const router = express.Router()
const { token } = require("morgan")
const userController = require("../controllers/user-Controller")


router.post("/createUser",userController.createUser)
router.post("/login",userController.login)

module.exports = router