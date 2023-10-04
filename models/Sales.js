const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    saleId: Number,
    items: [{
        name: String,
        quantity: Number,
        price: Number
    }],
    totalSalePrice: Number,
    totalQuantity: Number,
    date: Date
});

const Sales = mongoose.model('Sales', salesSchema);

module.exports = Sales;
