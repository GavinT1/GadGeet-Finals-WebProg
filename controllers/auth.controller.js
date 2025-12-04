const User = require('../Models/user.model.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const API_URL = "http://localhost:3000/api/auth";


const generateToken = (userId) => {
    return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.register = async (req, res) => {
    try {
        
        const { 
            username, 
            firstName, 
            lastName, 
            email, 
            password, 
            address, 
            phoneNumber 
        } = req.body;

        let user = await User.findOne({ 
            $or: [{ email: email }, { username: username }] 
        });

        if (user) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        
         user = new User({
          username,
          firstName,
        lastName,
          email,
          passwordHash: hashedPassword,
          phoneNumber,
   

      addresses: [{ 
        label: 'Home', 
        address: address, 
        city: 'City', 
        isDefault: true 
    }]
});

        await user.save();

        const token = generateToken(user.id);

        res.status(201).json({ 
            token,
            user: {
                id: user.id,
                username: user.username,
                firstName: user.firstName,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error(error.message); 
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        
        const { email, password, guestCart } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        
        if (guestCart && Array.isArray(guestCart) && guestCart.length > 0) {
            
            for (const guestItem of guestCart) {
                const existingItem = user.cart.find(dbItem => 
                    dbItem.product.toString() === guestItem.id && 
                    dbItem.variantId === (guestItem.variant || 'Standard')
                );

                if (existingItem) {
                    
                    existingItem.quantity += guestItem.quantity;
                } else {
                   
                    user.cart.push({
                        product: guestItem.id,
                        variantId: guestItem.variant || 'Standard',
                        quantity: guestItem.quantity
                    });
                }
            }
            await user.save(); 
        }
        
        await user.populate({
            path: 'cart.product',
            model: 'Product'
        });

        const token = generateToken(user._id);

        
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

        
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                isAdmin: user.isAdmin,
                addresses: user.addresses,
                phoneNumber: user.phoneNumber,
                cart: formattedCart 
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        
        user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 

        await user.save({ validateBeforeSave: false });

        
        const frontendURL = 'http://localhost:5173';
        const resetUrl = `${frontendURL}/?token=${resetToken}`;

        const message = `You have requested a password reset. Please go to this link: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message: message,
                url: resetUrl
            });

            res.status(200).json({ success: true, message: 'Email sent successfully!' });

        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined; 
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ message: 'Email could not be sent' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- 2. RESET PASSWORD ---
exports.resetPassword = async (req, res) => {
    try {
        const resetToken = req.body.token;

        
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

       
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(req.body.newPassword, salt);

       
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined; 

        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        
        
        const user = await User.findById(req.user.id);

       
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.updateAddresses = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        user.addresses = req.body.addresses; 
        
        await user.save();
        
        res.status(200).json({ success: true, addresses: user.addresses });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};