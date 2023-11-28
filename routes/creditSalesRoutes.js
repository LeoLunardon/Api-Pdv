const express = require("express");
const CreditSales = require("../models/CreditSales");
const creditSaleRoute = express.Router();

creditSaleRoute.post("/credit-sales", async (req, res) => {
  try {
    const saleData = {
      clientName: req.body.clientName,
      clientPhone: req.body.clientPhone,
      items: req.body.items,
      totalSalePrice: req.body.totalSalePrice,
      totalQuantity: req.body.totalQuantity,
      date: new Date(),
    };
    if (!req.body.clientName || !req.body.clientPhone || !req.body.items) {
      return res.status(400).send("Todos os campos devem ser preenchidos.");
    } else {
      const sale = new CreditSales(saleData);
      await sale.save();
      res.status(201).send("Venda de confiança criada com sucesso ");
    }
  } catch (error) {
    return res.status(501).send("Error creating sale: " + error.message);
  }
});

creditSaleRoute.get("/credit-sales", async (req, res) => {
  try {
    const creditSales = await CreditSales.find();
    res.status(200).json(creditSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = creditSaleRoute;
