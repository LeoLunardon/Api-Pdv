const express = require("express");
const loginRoute = express.Router();
const Users = require("../models/Users");
const jwt = require("jsonwebtoken");
const { checkToken } = require("../middlewares/middleware");

loginRoute.post("/login/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se o email já está cadastrado
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res
        .status(422)
        .json({ message: "Email já cadastrado no sistema" });
    }

    // Cria um novo usuário com a senha criptografada
    const newUser = new Users({
      name,
      email,
      password,
    });

    // Salva o usuário no banco de dados
    await newUser.save();

    // Envie a resposta com sucesso e possivelmente um token (dependendo da implementação)
    res.status(201).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

loginRoute.post("/login/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });

    if (!existingUser || existingUser.password !== password) {
      return res.status(404).json({ message: "Credenciais inválidas" });
    } else {
      const secret = process.env.SECRET;
      const token = jwt.sign({ id: existingUser._id }, secret);

      res.status(200).json({ message: "Login realizado com sucesso", token });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

loginRoute.get("/login/:id", async (req, res) => {
  const id = req.params.id;
  const existingUser = await Users.findById(id, "-password");

  if (!existingUser) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  } else {
    res.status(200).json(existingUser);
  }
});

module.exports = loginRoute;
