
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const Product = require('../models/product.model');

dotenv.config();
connectDB();

const mockProducts = [
    {
        name: "Anker Nano 3 (30W) GaN Charger",
        price: 1200.00,
        brand: "Accessories", 
        description: "A tiny but mighty charging brick. It uses Gallium Nitride (GaN) technology to be 70% smaller than standard chargers while fast-charging an iPhone or Samsung to 50% in just 25 minutes.",
        category: "Charger",
        imageUrl: "/images/Anker Nano 3 (30W) GaN Charger.png",
        variants: [{ name: "Standard (Black) 30W", price: 1200.00, stock: 15 }]
    },
    {
        name: "Anker 622 MagGo Magnetic Battery",
        price: 3400.00,
        brand: "Accessories",
        description: "A slim 5,000mAh power bank that snaps magnetically to the back of your phone. It has a foldable flap that turns it into a stand.",
        category: "Power Bank",
        imageUrl: "/images/Anker 622 MagGo Magnetic Battery (MagSafe).png",
        variants: [{ name: "Standard 5000mAh", price: 3400.00, stock: 8 }]
    },
    {
        name: "Whoosh! Screen Shine",
        price: 690.00,
        brand: "Accessories",
        description: "The viral screen cleaner used in Apple Stores. It’s a non-toxic spray that removes 99% of dust and fingerprints.",
        category: "Cleaning",
        imageUrl: "/images/Whoosh! Screen Shine (Go-Pocket Size).png",
        variants: [{ name: "Pocket Size", price: 690.00, stock: 50 }]
    },
    {
        name: "ShiftCam SnapGrip",
        price: 4500.00,
        brand: "Accessories",
        description: "A magnetic snap-on handle that gives your phone the grip and feel of a real DSLR camera.",
        category: "Camera Gear",
        imageUrl: "/images/ShiftCam SnapGrip.png",
        variants: [{ name: "Standard Grip", price: 4500.00, stock: 5 }]
    },
    {
        name: "DJI Osmo Mobile 6 Gimbal",
        price: 8990.00,
        brand: "Accessories",
        description: "A 3-axis stabilizer that eliminates shaky hands from your videos. Foldable and smart tracking.",
        category: "Camera Gear",
        imageUrl: "/images/DJI Osmo Mobile 6 Gimbal.png",
        variants: [{ name: "Standard Model", price: 8990.00, stock: 3 }]
    },
    {
        name: "Backbone One (Gen 2) Controller",
        price: 5800.00,
        brand: "Accessories",
        description: "The best telescopic controller that clamps onto your phone to turn it into a handheld console.",
        category: "Gaming",
        imageUrl: "/images/Backbone One (Gen 2) Controller.png",
        variants: [{ name: "Gen 2 Controller", price: 5800.00, stock: 7 }]
    },
    {
        name: "Sony WF-1000XM5 Wireless Earbuds",
        price: 13999.00,
        brand: "Accessories",
        description: "Widely considered the king of noise cancellation. Premium audio quality.",
        category: "Audio",
        imageUrl: "/images/Sony WF-1000XM5 Wireless Earbuds.png",
        variants: [
            { name: "Black", price: 13999.00, stock: 4 },
            { name: "Silver", price: 13999.00, stock: 4 }
        ]
    },
    {
        name: "Alpaka Elements Tech Case Mini",
        price: 2700.00,
        brand: "Accessories",
        description: "A compact, weather-proof organizer pouch for your daily tech.",
        category: "Pouch",
        imageUrl: "/images/Alpaka Elements Tech Case Mini .png",
        variants: [{ name: "Mini Black", price: 2700.00, stock: 12 }]
    },
    {
        name: "ESR Geo Wallet Stand (with Find My)",
        price: 1900.00,
        brand: "Accessories",
        description: "A magnetic wallet that holds 3 cards and works with Apple Find My.",
        category: "Wallet",
        imageUrl: "/images/ESR Geo Wallet Stand (with Find My) .png",
        variants: [{ name: "Standard Black", price: 1900.00, stock: 9 }]
    },
    {
        name: "CASETiFY Utility Crossbody Lanyard",
        price: 2300.00,
        brand: "Accessories",
        description: "A trendy and functional rope strap that lets you wear your phone like a crossbody bag.",
        category: "Lanyard",
        imageUrl: "/images/CASETiFY Utility Crossbody Lanyard.png",
        variants: [{ name: "Black Rope", price: 2300.00, stock: 18 }]
    },
    {
        name: "Huawei Mate X5",
        price: 2399.00,
        brand: "Huawei",
        description: "Ultra-light, ultra-thin foldable with Kunlun Glass protection.",
        category: "Foldable",
        imageUrl: "/images/huaweimatex5jpg.jpg",
        variants: [
            { name: "Phantom Purple 512GB", price: 2399.00, stock: 3 },
            { name: "Feather Gold 1TB", price: 2599.00, stock: 2 },
        ]
    },
    {
        name: "Huawei Nova 12 Ultra",
        price: 650.00,
        brand: "Huawei",
        description: "Stylish mid-range focused on selfie vlogging and design.",
        category: "Mid-Range",
        imageUrl: "/images/huaweinova12jpg.jpg",
        variants: [
            { name: "Color No. 12 (Blue) 512GB", price: 650.00, stock: 30 },
            { name: "Obsidian Black 512GB", price: 650.00, stock: 25 },
        ]
    },
    {
        name: "Huawei Pocket 2",
        price: 1050.00,
        brand: "Huawei",
        description: "A fashionable clamshell foldable with a unique circular cover screen.",
        category: "Foldable",
        imageUrl: "/images/Huawei-Pocket-2_featured-image-packshot-review-Recovered.png",
        variants: [{ name: "Tahitian Gray 256GB", price: 1050.00, stock: 18 }]
    },
    {
        name: "Samsung Galaxy S23 FE",
        price: 599.00,
        brand: "Samsung",
        description: "Fan Edition offering flagship features at a mid-range price.",
        category: "Mid-Range",
        imageUrl: "/images/191680_2024.jpg",
        variants: [
            { name: "Mint 128GB", price: 599.00, stock: 55 },
            { name: "Cream 256GB", price: 659.00, stock: 30 },
        ]
    },
    {
        name: "Samsung Galaxy A55 5G",
        price: 479.00,
        brand: "Samsung",
        description: "Premium build quality (metal frame) in the A-series lineup.",
        category: "Mid-Range",
        imageUrl: "/images/SAMUNTGALAXYS23FEPURPLE1_1000x1000.webp",
        variants: [
            { name: "Awesome Iceblue 128GB", price: 479.00, stock: 70 },
            { name: "Awesome Navy 256GB", price: 529.00, stock: 50 },
        ]
    },
    {
        name: "iPhone 15",
        price: 799.00,
        brand: "Apple",
        description: "The standard for most users, featuring a 48MP main camera.",
        category: "Flagship",
        imageUrl: "/images/Iphone 15 Blue 128GB.png",
        variants: [
            { name: "Blue 128GB", price: 799.00, stock: 50 },
            { name: "Green 256GB", price: 899.00, stock: 35 },
        ]
    },
    {
        name: "iPhone 14",
        price: 699.00,
        brand: "Apple",
        description: "A reliable choice with great dual-camera system and crash detection.",
        category: "Standard",
        imageUrl: "/images/Iphone 14 Midnight 128GB.png",
        variants: [
            { name: "Midnight 128GB", price: 699.00, stock: 60 },
            { name: "Starlight 256GB", price: 799.00, stock: 20 },
        ]
    },
    {
        name: "iPhone 13",
        price: 599.00,
        brand: "Apple",
        description: "Excellent value entry-point into the modern FaceID design.",
        category: "Standard",
        imageUrl: "/images/Iphone 13 Green 128GB.png",
        variants: [
            { name: "Green 128GB", price: 599.00, stock: 40 },
            { name: "Pink 128GB", price: 599.00, stock: 30 },
        ]
    },
    {
        name: "iPhone SE (3rd Gen)",
        price: 429.00,
        brand: "Apple",
        description: "Classic design with a Home button and modern 5G performance.",
        category: "Budget",
        imageUrl: "/images/Iphone Se (3rd gen) Red 128GB.png",
        variants: [
            { name: "Midnight 64GB", price: 429.00, stock: 80 },
            { name: "Red 128GB", price: 479.00, stock: 45 },
        ]
    }
];

const importData = async () => {
    try {
        await Product.deleteMany(); 
        await Product.insertMany(mockProducts);
        console.log('✅ Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

importData();