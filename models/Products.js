const mongoose  = require('mongoose');

const Products = mongoose.model('Products',{
    name: String,
    price: Number,
    salePrice: Number,
    quantity: Number
});


module.exports = Products;