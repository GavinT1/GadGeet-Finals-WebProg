const Supplier = require('../Models/supplier.model.js');

// 1. Create
exports.createSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        const savedSupplier = await supplier.save();
        res.status(201).json(savedSupplier);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 2. Get All
exports.getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find({});
        res.json(suppliers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 3. Get One
exports.getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 4. Update
exports.updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (supplier) {
            supplier.name = req.body.name || supplier.name;
            supplier.contactPerson = req.body.contactPerson || supplier.contactPerson;
            supplier.email = req.body.email || supplier.email;
            supplier.phone = req.body.phone || supplier.phone;
            supplier.address = req.body.address || supplier.address;
            
            if (req.body.isActive !== undefined) {
                supplier.isActive = req.body.isActive;
            }

            const updatedSupplier = await supplier.save();
            res.json(updatedSupplier);
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// 5. Delete
exports.deleteSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (supplier) {
            await supplier.deleteOne();
            res.json({ message: 'Supplier removed' });
        } else {
            res.status(404).json({ message: 'Supplier not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};