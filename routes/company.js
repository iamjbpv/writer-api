const express = require("express");
const Company = require("../models/Company");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");
const path = require("path");
const fs = require("fs");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { logoFile } = req.body;
    let logoUrl = null;
    if (logoFile) {
      const base64Data = logoFile.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const filename = `${Date.now()}.png`;
      const uploadPath = path.join(__dirname, "../uploads/company", filename);

      fs.writeFileSync(uploadPath, buffer);
      logoUrl = process.env.APP_URL + `/uploads/company/${filename}`;
    }

    const companyData = {
      ...req.body,
      logo: logoUrl,
    };

    const company = await Company.create(companyData);
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const company = await Company.findByPk(id);
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ message: "Company not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { logoFile } = req.body;
    let logoUrl = null;
    let companyData = {
      ...req.body,
      logo: logoUrl,
    };
    if (logoFile) {
      const base64Data = logoFile.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      const filename = `${Date.now()}.png`;
      const uploadPath = path.join(__dirname, "../uploads/company", filename);

      fs.writeFileSync(uploadPath, buffer);
      logoUrl = process.env.APP_URL + `/uploads/company/${filename}`;

      companyData = {
        ...req.body,
        logo: logoUrl,
      };
    }
    const [company] = await Company.update(companyData, {
      where: { id: req.params.id },
    });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const deleted = await Company.destroy({ where: { id: req.params.id } });
    res.json(
      deleted
        ? { message: "Company deleted" }
        : { message: "Company not found" }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
