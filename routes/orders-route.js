const express = require("express")
const router = express.Router()


const ordersController = require("../controllers/order-controller")

router.get("/", ordersController.getOrders)
router.post("/", ordersController.postOrder )
router.get("/:orderId", ordersController.getIdOrder)
router.delete("/:orderId", ordersController.deleteOrder)

module.exports = router