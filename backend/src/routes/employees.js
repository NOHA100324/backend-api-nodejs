const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdmin, employeesController.getAllEmployees);
router.post('/', verifyToken, isAdmin, employeesController.createEmployee);


module.exports = router;
