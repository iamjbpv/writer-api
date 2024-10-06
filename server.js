const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config");
const authRoute = require("./routes/auth");
const companyRoutes = require("./routes/company");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
const seedUsers = require("./seeders/userSeeder");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use("/company", companyRoutes);
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);

const startServer = async () => {
  try {
    // await sequelize.sync({ force: true }); //drop tables
    await seedUsers();
    app.listen(3000, () => console.log("Server running on port 3000"));
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
