const mongoose = require('mongoose');

const CartModel = mongoose.model(
    'cart', 
    new mongoose.Schema({
        products: {type: Array},
        timeStamp: {type: String}
    })
);
 
module.exports = CartModel;