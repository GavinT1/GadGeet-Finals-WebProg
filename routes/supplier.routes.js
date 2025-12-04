const express = require('express');
const router = express.Router();

const {
    createSupplier,
    getAllSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier
} = require('../controllers/supplier.controller.js');

const { protect, admin } = require('../middleware/auth.js');

router.use(protect);
router.use(admin);
router.route('/')
    .get(getAllSuppliers)   
    .post(createSupplier);
router.route('/:id')
    .get(getSupplierById)
    .put(updateSupplier)
    .delete(deleteSupplier);

module.exports = router;