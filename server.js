const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
process.env.NODE_ENV = "production";

dotenv.config();

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
app.use(express.json());

// Models and Routes imports
const Products = require("./models/Products");
const Users = require("./models/Users");
const route = require("./routes/productRoutes");
const salesRoute = require("./routes/salesRoutes");
const loginRoute = require("./routes/loginRoutes");
app.use(salesRoute);
app.use(loginRoute);
app.use(route);

const DB_URL = process.env.DB_URL;
const port = process.env.PORT || 3000;

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(port, () => {
      console.log("Server is running on port", port);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
