const User = require('../Models/user.model');
const Product = require('../Models/product.model');

exports.getCart = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'cart.product',
            model: 'Product',
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const formattedCart = user.cart.map(item => {
            if (!item.product) return null; 

            const variant = item.product.variants?.find(v => v._id.toString() === item.variantId);

            return {
                id: item.product._id,
                name: item.product.name,
                price: variant ? variant.price : item.product.price,
                imageUrl: item.product.imageUrl,
                variant: item.variantId,
                quantity: item.quantity
            };
        }).filter(Boolean); 

        res.json(formattedCart);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, variantId, quantity } = req.body;

        let user = await User.findOneAndUpdate(
            { 
                _id: req.user.id, 
                "cart.product": productId, 
                "cart.variantId": variantId 
            },
            { 
                $inc: { "cart.$.quantity": quantity } 
            },
            { new: true } 
        );

        if (!user) {
            
            const product = await Product.findById(productId);
            if (!product) return res.status(404).json({ message: 'Product not found' });
            
            user = await User.findByIdAndUpdate(
                req.user.id,
                { 
                    $push: { 
                        cart: { 
                            product: productId, 
                            variantId: variantId, 
                            quantity: quantity 
                        } 
                    } 
                },
                { new: true }
            );
        }

        res.status(200).json(user.cart);

    } catch (error) {
        console.error("Cart Error:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { variantId } = req.params;
        
        console.log(`Attempting to remove variantId: ${variantId} for user ${req.user.id}`);

        await User.updateOne(
            { _id: req.user.id },
            { $pull: { cart: { variantId: variantId } } }
        );
        const user = await User.findById(req.user.id).populate({
            path: 'cart.product',
            model: 'Product',
        });

        const formattedCart = user.cart.map(item => {
            if (!item.product) return null;
            const variant = item.product.variants?.find(v => v._id.toString() === item.variantId);
            return {
                id: item.product._id,
                name: item.product.name,
                price: variant ? variant.price : item.product.price,
                imageUrl: item.product.imageUrl,
                variant: item.variantId,
                quantity: item.quantity
            };
        }).filter(Boolean);

        res.json(formattedCart);

    } catch (error) {
        console.error("Remove Error:", error.message);
        res.status(500).json({ message: 'Server error' });
    }
};