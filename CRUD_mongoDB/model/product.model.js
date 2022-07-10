const mongoose = require('mongoose');

const ProductModel = mongoose.model(
    'products', 
    new mongoose.Schema({
        name: String,
        price: Number,
        img_url: String,
        description: String,
        code: String,
        stock: Number
    })
);
 
module.exports = ProductModel;