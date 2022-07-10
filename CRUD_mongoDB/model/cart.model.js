const mongoose = require('mongoose');

const ProductModel = mongoose.model(
    'cart', 
    new mongoose.Schema({
        products: [{ type: String }],
        timeStamp: Date
    })
);
 
module.exports = ProductModel;