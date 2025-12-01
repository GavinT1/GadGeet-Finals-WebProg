const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    fakePayOrder,
    getAllOrders,
    updateOrderToPaid,
    updateOrderToDelivered
    
} = require('../controllers/order.controller.js');
const { protect, admin}= require('../middleware/auth.js');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.post('/:id/fakepay', protect, fakePayOrder);
router.get('/:id', protect, getOrderById);

router.get('/', protect, admin, getAllOrders);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;