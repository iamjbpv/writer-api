const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("../config");
const authRoute = require("../routes/auth");
const companyRoutes = require("../routes/company");
const userRoutes = require("../routes/user");
const articleRoutes = require("../routes/article");
const seedUsers = require("../seeders/userSeeder");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use("/company", companyRoutes);
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
