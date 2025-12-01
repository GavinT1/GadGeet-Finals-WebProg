const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a supplier name'],
        trim: true,
    },
    contactPerson: {
        type: String,
        required: [true, 'Please provide a contact person name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide an email address'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    phone: {
        type:String,
        required: [true, 'Please provide a phone number'],
    },
    address: {
        type: String,
        required: [true, 'Please provide a supplier address'],
    },
    isActive: {
        type: Boolean,
        default: true,
    }
   },{
     timestamps: true
});
module.exports = mongoose.model('Supplier', supplierSchema);