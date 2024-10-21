const express = require("express")
const router = express.Router()
const login = require("../middleware/login")
const ImagemController = require("../controllers/images-controller")

router.delete("/:imageId",login.required, ImagemController.deleteImage)

module.exports = router