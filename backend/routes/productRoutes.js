// routes/productRoutes.js
const express = require("express");
const {
  listTransactions,
  getStatistics,
  getPriceRangeDistribution,
  getCategoryDistribution,
  getCombinedData,
} = require("../controllers/productController");
const router = express.Router();

router.get("/transactions", listTransactions);
router.get("/statistics", getStatistics);
router.get("/price-range-distribution", getPriceRangeDistribution);
router.get('/category-distribution', getCategoryDistribution);  
router.get('/combined-data', getCombinedData);  


module.exports = router;
