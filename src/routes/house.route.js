const express = require('express')
const router = express.Router()
const houseController = require('../controllers/house.controller')

router.get('/all', houseController.getAll)
router.get('/:id', houseController.get)
router.patch('/update/:id', houseController.update)
router.post('/create', houseController.create)
router.delete('/:id', houseController.delete)

module.exports = router