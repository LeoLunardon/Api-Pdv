const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

module.exports = mongoose.model("Customers", customersSchema);
