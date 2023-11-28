const express = require("express");
const salesRoute = express.Router();
const Sales = require("../models/Sales");


salesRoute.post("/sales-history", async (req, res) => {
  try {
    const lastSale = await Sales.findOne({}, {}, { sort: { saleId: -1 } });
    const lastSaleId = lastSale ? lastSale.saleId : 0;
    const newSaleId = lastSaleId + 1;

    const saleData = {
      saleId: newSaleId,
      items: req.body.items,
      totalSalePrice: req.body.totalSalePrice,
      totalQuantity: req.body.totalQuantity,
      date: new Date(),
    };

    const sale = new Sales(saleData);
    await sale.save();
    res.status(201).send("Sale created successfully.");
  } catch (error) {
    res.status(500).send("Error creating sale: " + error.message);
  }
});

salesRoute.get("/sales-history", async (req, res) => {
  try {
    const sales = await Sales.find();
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = salesRoute;







