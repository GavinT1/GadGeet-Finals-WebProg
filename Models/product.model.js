const mongoose = require('mongoose');

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

const productSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },

    brand:{
        type: String,
        required: true,
    },

    description:{
        type: String,
        required: true,
    },
    
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
    
    supplierId: {
        type: Number, 
        required: false, 
    },
    
    unitPrice: {
        type: Number,
        required: false,
    },
    
    costPrice: {
        type: Number,
        required: false,
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    specs:{
        type: Object,
    },
    variants:[variantSchema],
}, {
    timestamps: true 
});

module.exports = mongoose.model('Product', productSchema);