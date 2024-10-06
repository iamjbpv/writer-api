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
    // await sequelize.sync({ force: true }); // Drop tables
    await seedUsers();
    return app; // Return the app instance
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error; // Rethrow error to prevent serverless function from starting
  }
};

// This will be used by Vercel
if (require.main === module) {
  startServer().then(() => {
    const PORT = process.env.PORT || 3000; // Use dynamic port
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log(`Server is running on port ${PORT}`);
  });
} else {
  module.exports = startServer; // Export for Vercel
}
