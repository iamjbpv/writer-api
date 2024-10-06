const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config");
const authRoute = require("./routes/auth");
const companyRoutes = require("./routes/company");
const userRoutes = require("./routes/user");
const articleRoutes = require("./routes/article");
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
    await sequelize.sync(); // Sync your database
    await seedUsers();
    return app; // Return the app instance
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error; // Rethrow error to prevent function from starting
  }
};

// Export for Vercel
module.exports = (req, res) => {
  startServer()
    .then((app) => {
      app(req, res); // Pass the request and response to the Express app
    })
    .catch((error) => {
      console.error("Error starting server:", error);
      res.status(500).send("Internal Server Error");
    });
};
