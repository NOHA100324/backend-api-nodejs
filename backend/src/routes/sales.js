const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, isAdmin, salesController.getAllSales);
router.post('/', verifyToken, salesController.createSale);


module.exports = router;
