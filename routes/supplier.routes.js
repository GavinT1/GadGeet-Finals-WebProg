const express = require('express');
const router = express.Router();

// Import the functions we just created in Step 1
const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require('../controllers/supplier.controller.js');

const { protect, admin } = require('../middleware/auth.js');

// Protect all routes (Admin only)
router.use(protect);
router.use(admin);

// Route for /api/suppliers
router.route('/')
    .get(getAllSuppliers)   
    .post(createSupplier);

// Route for /api/suppliers/:id
router.route('/:id')
    .get(getSupplierById)
    .put(updateSupplier)
    .delete(deleteSupplier);

module.exports = router;