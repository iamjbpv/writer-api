const express = require("express");
const Article = require("../models/Article");
const User = require("../models/User");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const Company = require("../models/Company");
const path = require("path");
const fs = require("fs");
router.post("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);
    const { imageFile } = req.body;

    let imageUrl = null;
    if (imageFile) {
      const base64Data = imageFile.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const filename = `${Date.now()}.png`;
      const uploadPath = path.join(__dirname, "../uploads/article", filename);

      fs.writeFileSync(uploadPath, buffer);
      imageUrl = process.env.APP_URL + `/uploads/article/${filename}`;
    }
    let articleData = {
      ...req.body,
      UserId: userId,
      image: imageUrl,
    };
    if (user.type == "Writer") {
      articleData = {
        ...req.body,
        UserId: userId,
        image: imageUrl,
        writerId: userId,
      };
    } else if (user.type == "Editor") {
      articleData = {
        ...req.body,
        UserId: userId,
        image: imageUrl,
        editorId: userId,
      };
    }

    const article = await Article.create(articleData);
    res.status(201).json(article);
  } catch (error) {
    console.error("Error saving article:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const companies = await Article.findAll({
      include: [
        {
          model: User,
          as: "writer",
          attributes: ["Firstname", "Lastname", "Type"],
        },
        {
          model: User,
          as: "editor",
          attributes: ["Firstname", "Lastname", "Type"],
        },
        {
          model: Company,
          attributes: ["name"],
        },
      ],
    });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const article = await Article.findByPk(id, {
      include: [
        {
          model: User,
          as: "writer",
          attributes: ["Firstname", "Lastname", "Type"],
        },
        {
          model: User,
          as: "editor",
          attributes: ["Firstname", "Lastname", "Type"],
        },
        {
          model: Company,
          attributes: ["name"],
        },
      ],
    });
    if (article) {
      res.json(article);
    } else {
      res.status(404).json({ message: "Article not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    const { imageFile } = req.body;

    let imageUrl = null;
    let articleData = {
      ...req.body,
      UserId: userId,
    };
    if (imageFile) {
      const base64Data = imageFile.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const filename = `${Date.now()}.png`;
      const uploadPath = path.join(__dirname, "../uploads/article", filename);

      fs.writeFileSync(uploadPath, buffer);
      imageUrl = process.env.APP_URL + `/uploads/article/${filename}`;
      articleData = {
        ...req.body,
        UserId: userId,
        image: imageUrl,
      };
    }
    if (user.type == "Writer") {
      articleData = {
        ...articleData,
        writerId: userId,
      };
    } else if (user.type == "Editor") {
      articleData = {
        ...articleData,
        editorId: userId,
      };
    }
    const article = await Article.update(articleData, {
      where: { id: req.params.id },
    });
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Article.destroy({ where: { id: req.params.id } });
    res.json(
      deleted
        ? { message: "Article deleted" }
        : { message: "Article not found" }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
