// routes/initializeRoutes.js
const express = require("express");
const { initializeDatabase } = require("../controllers/initializeController");
const router = express.Router();

router.post("/initialize", initializeDatabase);

module.exports = router;
