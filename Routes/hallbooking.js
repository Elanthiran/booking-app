const express = require('express')
const HallController = require("../Controller/hallbooking")
const router = express.Router()

router.get('/view',HallController.view)
router.post('/rooms/create',HallController.createRoom)
router.post('/booking/createroom/:id',HallController.bookingRoom)
router.get('/viewbooking',HallController.getAllBookedRooms)
router.get('/customers',HallController.getAllCustomers)
router.get('/customer/:name',HallController.getBookingCountByCustomer)


module.exports = router;