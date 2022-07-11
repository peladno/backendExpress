const mongoose = require('mongoose');

const ProductModel = mongoose.model(
    'cart', 
    new mongoose.Schema({
        products: [{ type: String }],
        timeStamp: {type: String}
    })
);
 
module.exports = ProductModel;