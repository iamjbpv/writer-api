const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config");
const authRoute = require("./api/auth");
const companyRoutes = require("./api/company");
const userRoutes = require("./api/users");
const articleRoutes = require("./api/articles");
const seedUsers = require("./seeders/userSeeder");

const app = express();

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoute);
app.use("/company", companyRoutes);
app.use("/users", userRoutes);
app.use("/articles", articleRoutes);

const startServer = async () => {
  try {
    // await sequelize.sync({ force: true }); // Drop tables
    await seedUsers();
    return app;
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

if (require.main === module) {
  startServer().then(() => {
    app.listen(3000, () => console.log("Server running on port 3000"));
  });
} else {
  module.exports = startServer;
}
