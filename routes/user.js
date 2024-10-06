const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

const isEditor = (req, res, next) => {
  const user = req.user;

  if (user && user.Type === "Editor") {
    next();
  } else {
    res
      .status(403)
      .json({ message: "Forbidden: Only editors can perform this action." });
  }
};

router.post("/", authenticateToken, async (req, res) => {
  const { password, ...userData } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const companies = await User.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  const { password, ...userData } = req.body;
  const { id } = req.params;

  try {
    let updateData = userData;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData = {
        ...userData,
        password: hashedPassword,
      };
    }

    const [updated] = await User.update(updateData, {
      where: { id },
    });

    if (updated) {
      const updatedUser = await User.findByPk(id);
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, isEditor, async (req, res) => {
  try {
    const deleted = await User.destroy({ where: { id: req.params.id } });
    res.json(
      deleted ? { message: "User deleted" } : { message: "User not found" }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
