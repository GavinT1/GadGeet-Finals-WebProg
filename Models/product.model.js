const mongoose = require('mongoose');

// Variant Schema (Kept exactly as you had it)
const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    color: String,
    storage: String,
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    Images: [String],
});

// Product Schema
const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },

    brand:{
        type: String,
        required: true,
    },
    // Matches 'description' from image
    description:{
        type: String,
        required: true,
    },
    // Matches 'category_id' from image (kept as String per your existing code)
    category:{
        type: String,
        required: true,
    },

    imageUrl:{
        type: String,
        required: true,
    },

    price:{
        type: Number,
        required: true,
    },
    
    // Matches 'supplier_id' (INT)
    supplierId: {
        type: Number, 
        required: false, // Set to true if you want to force it
    },
    
    // Matches 'unit_price' (DECIMAL)
    unitPrice: {
        type: Number,
        required: false, // Optional, since you have price in variants
    },
    
    // Matches 'cost_price' (DECIMAL)
    costPrice: {
        type: Number,
        required: false,
    },

    // Matches 'is_active' (BOOLEAN DEFAULT TRUE)
    isActive: {
        type: Boolean,
        default: true,
    },
    // -------------------------------

    specs:{
        type: Object,
    },
    variants:[variantSchema],
}, {
    timestamps: true // Matches 'created_at' and 'updated_at' from image
});

module.exports = mongoose.model('Product', productSchema);