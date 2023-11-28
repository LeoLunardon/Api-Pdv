const express = require("express");
const route = express.Router();
const Products = require("../models/Products");
const Sales = require("../models/Sales");

//Criação de um novo produto
route.post("/product", async (req, res) => {
  const { name, price, quantity, salePrice } = req.body;
  const product = {
    name,
    price,
    salePrice,
    quantity,
  };
  try {
    let existingProduct = await Products.findOne({
      name: { $regex: new RegExp(name, "i") },
    });
    if (existingProduct) {
      // Se o produto já existe, atualize os dados
      existingProduct.price = price;
      existingProduct.salePrice = salePrice;
      existingProduct.quantity += parseInt(quantity);
      await existingProduct.save();
      res.status(200).json({ message: "Produto atualizado com sucesso." });
    } else {
      // Se não existe, crie um novo produto
      const newProduct = new Products({
        name,
        price,
        salePrice,
        quantity,
      });

      await newProduct.save();
      res.status(201).json({ message: "Produto criado com sucesso." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listagem de todos os produtos
route.get("/product", async (req, res) => {
  try {
    const products = await Products.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

route.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Products.findById({ _id: id }); // Update this line

    if (!product) {
      return res.status(422).json({ message: "Produto não encontrado" });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Rota para atualizar os dados de um produto
route.patch("/product/:id", async (req, res) => {
  const id = req.params.id;
  const { name, price, salePrice, quantity } = req.body;

  try {
    const product = await Products.findById(id);

    if (!product) {
      return res.status(422).json({ message: "Produto não encontrado" });
    }

    // Atualiza os campos do produto
    product.name = name;
    product.price = price;
    product.quantity = quantity;
    product.salePrice = salePrice;

    // Salva a atualização no banco de dados
    await product.save();

    res.status(200).json({ message: "Produto atualizado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

route.patch("/product/:id/quantity", async (req, res) => {
  const id = req.params.id;
  const { quantity } = req.body;

  try {
    const product = await Products.findById(id);

    if (!product) {
      return res.status(422).json({ message: "Produto não encontrado" });
    }

    // Verifica se a quantidade a ser vendida é maior que a disponível
    if (product.quantity < quantity) {
      return res
        .status(422)
        .json({ message: "Quantidade insuficiente em estoque" });
    }

    // Atualizar a quantidade do produto
    product.quantity -= quantity;

    // Se a quantidade for 0, deletar o produto
    if (product.quantity === 0) {
      await Products.findByIdAndRemove(id);
      return res.status(200).json({ message: "Produto deletado com sucesso." });
    } else {
      await product.save();
      return res
        .status(200)
        .json({ message: "Produto atualizado com sucesso." });
    }
  } catch (error) {
    console.error("Erro ao atualizar a quantidade:", error);
    return res.status(500).json({ error: error.message });
  }
});

//Rota para deletar um produto
route.delete("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Products.findByIdAndDelete({ _id: id });
  try {
    if (!product) {
      return res.status(422).json({ message: "Produto não encontrado" });
    }

    res.status(200).json("o produto " + product.name + " foi deletado");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Rota para obter o valor total de vendas
route.get("/dashboard", async (req, res) => {
  try {
    const sales = await Sales.find();
    const products = await Products.find();

    const productsPrice = products.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    const salesPrice = sales.reduce((acc, sale) => {
      return (
        acc +
        sale.items.reduce((total, item) => {
          return total + item.quantity * item.price; // preço de compra
          
        }, 0)
      );
    }, 0);

    const salesQuantity = sales.length;
    const profit = salesPrice - productsPrice;
    const profitFixed = profit.toFixed(2);
    const productsPriceFixed = productsPrice.toFixed(2);
    

    res.status(200).json({ productsPriceFixed, salesPrice, profitFixed, salesQuantity });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

route.get("/filtered-sales", async (req, res) => {
  try {
    const aggregatedSales = await Sales.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.name",
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
    ]);
    const filteredSales = aggregatedSales.map((result) => {
      return {
        name: result._id,
        totalQuantity: result.totalQuantity,
      };
    });
    return res.status(200).json(filteredSales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = route;
