const express = require("express");
const Customers = require("../models/Costumers");

const customersRoute = express.Router();

customersRoute.post("/customers", async (req, res) => {
  try {
    const customersData = {
      name: req.body.name,
      phone: req.body.phone,
    };
    if (!req.body.name || !req.body.phone) {
      return res.status(400).send("Todos os campos devem ser preenchidos");
    } else {
      const customers = new Customers(customersData);
      await customers.save();
      res.status(201).send("Cliente cadastrado com sucesso");
    }
  } catch (error) {
    res.status(500).send("Error creating costumer: " + error.message);
  }
});

customersRoute.get("/customers", async (req, res) => {
  try {
    const customers = await Customers.find();
    res.send(customers);
    console.log(customers);
  } catch (error) {
    res.status(500).send("Erro ao buscar clientes: " + error.message);
  }
});

module.exports = customersRoute;
