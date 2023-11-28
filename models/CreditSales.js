const mongoose = require("mongoose");

const creditSalesSchema = new mongoose.Schema({
  clientName: String,
  clientPhone: String,
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalSalePrice: Number,
  totalQuantity: Number,
  date: Date,
});

const CreditSales = mongoose.model("CreditSales", creditSalesSchema);

module.exports = CreditSales;
