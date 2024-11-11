// controllers/productController.js
const Product = require("../models/productModel");

const listTransactions = async (req, res) => {
  const { month, search = "", page = 1, perPage = 10 } = req.query;

  try {
    const matchConditions = {};

    // Filter by month (ignoring the year)
    if (month) {
      const monthIndex = new Date(`${month} 1, 2000`).getMonth(); // Get month index from month name
      matchConditions.$expr = {
        $eq: [{ $month: "$dateOfSale" }, monthIndex + 1], // MongoDB months are 1-indexed
      };
    }

    // Search by title, description, or price
    if (search) {
      matchConditions.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: parseFloat(search) || 0 },
      ];
    }

    // Pagination setup
    const limit = parseInt(perPage);
    const skip = (parseInt(page) - 1) * limit;

    // Fetch data with applied filters and pagination
    const products = await Product.find(matchConditions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination metadata
    const total = await Product.countDocuments(matchConditions);
    const totalPages = Math.ceil(total / limit);

    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        perPage: limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error listing transactions:", error);
    res.status(500).json({ message: "Error retrieving transactions" });
  }
};

const getStatistics = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  try {
    // Convert month name to month index (1-12)
    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;

    // Filter criteria for the selected month, regardless of year
    const matchConditions = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
    };

    // Calculate statistics
    const totalSalesAmount = await Product.aggregate([
      { $match: { ...matchConditions, sold: true } },
      { $group: { _id: null, totalAmount: { $sum: "$price" } } },
    ]);

    const totalSoldItems = await Product.countDocuments({
      ...matchConditions,
      sold: true,
    });

    const totalNotSoldItems = await Product.countDocuments({
      ...matchConditions,
      sold: false,
    });

    res.json({
      totalSaleAmount: totalSalesAmount[0]?.totalAmount || 0,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
};

const getPriceRangeDistribution = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  try {
    // Convert month name to month index (1-12)
    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;

    // Define the filter for the selected month, regardless of year
    const matchConditions = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
    };

    // Define the price ranges for the facet pipeline
    const priceRanges = {
      "0-100": { $and: [{ price: { $gte: 0 } }, { price: { $lte: 100 } }] },
      "101-200": { $and: [{ price: { $gte: 101 } }, { price: { $lte: 200 } }] },
      "201-300": { $and: [{ price: { $gte: 201 } }, { price: { $lte: 300 } }] },
      "301-400": { $and: [{ price: { $gte: 301 } }, { price: { $lte: 400 } }] },
      "401-500": { $and: [{ price: { $gte: 401 } }, { price: { $lte: 500 } }] },
      "501-600": { $and: [{ price: { $gte: 501 } }, { price: { $lte: 600 } }] },
      "601-700": { $and: [{ price: { $gte: 601 } }, { price: { $lte: 700 } }] },
      "701-800": { $and: [{ price: { $gte: 701 } }, { price: { $lte: 800 } }] },
      "801-900": { $and: [{ price: { $gte: 801 } }, { price: { $lte: 900 } }] },
      "901-above": { price: { $gte: 901 } },
    };

    // Use $facet to create a pipeline for each price range
    const priceRangeData = await Product.aggregate([
      { $match: matchConditions },
      {
        $facet: {
          "0-100": [{ $match: priceRanges["0-100"] }, { $count: "count" }],
          "101-200": [{ $match: priceRanges["101-200"] }, { $count: "count" }],
          "201-300": [{ $match: priceRanges["201-300"] }, { $count: "count" }],
          "301-400": [{ $match: priceRanges["301-400"] }, { $count: "count" }],
          "401-500": [{ $match: priceRanges["401-500"] }, { $count: "count" }],
          "501-600": [{ $match: priceRanges["501-600"] }, { $count: "count" }],
          "601-700": [{ $match: priceRanges["601-700"] }, { $count: "count" }],
          "701-800": [{ $match: priceRanges["701-800"] }, { $count: "count" }],
          "801-900": [{ $match: priceRanges["801-900"] }, { $count: "count" }],
          "901-above": [
            { $match: priceRanges["901-above"] },
            { $count: "count" },
          ],
        },
      },
    ]);

    // Format the response to match the expected output
    const formattedResponse = [
      { range: "0-100", count: priceRangeData[0]["0-100"][0]?.count || 0 },
      { range: "101-200", count: priceRangeData[0]["101-200"][0]?.count || 0 },
      { range: "201-300", count: priceRangeData[0]["201-300"][0]?.count || 0 },
      { range: "301-400", count: priceRangeData[0]["301-400"][0]?.count || 0 },
      { range: "401-500", count: priceRangeData[0]["401-500"][0]?.count || 0 },
      { range: "501-600", count: priceRangeData[0]["501-600"][0]?.count || 0 },
      { range: "601-700", count: priceRangeData[0]["601-700"][0]?.count || 0 },
      { range: "701-800", count: priceRangeData[0]["701-800"][0]?.count || 0 },
      { range: "801-900", count: priceRangeData[0]["801-900"][0]?.count || 0 },
      {
        range: "901-above",
        count: priceRangeData[0]["901-above"][0]?.count || 0,
      },
    ];

    res.json(formattedResponse);
  } catch (error) {
    console.error("Error fetching price range distribution:", error);
    res
      .status(500)
      .json({ message: "Error fetching price range distribution" });
  }
};


const getCategoryDistribution = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ message: "Month is required" });
  }

  try {
    // Convert month name to month index (1-12)
    const monthIndex = new Date(`${month} 1, 2000`).getMonth() + 1;

    // Filter condition for the selected month, regardless of year
    const matchConditions = {
      $expr: { $eq: [{ $month: "$dateOfSale" }, monthIndex] },
    };

    // Aggregate data to get the count of items in each category
    const categoryData = await Product.aggregate([
      { $match: matchConditions },
      {
        $group: {
          _id: "$category",
          itemCount: { $sum: 1 },
        },
      },
      { $sort: { itemCount: -1 } }, // Optional: sort categories by count in descending order
    ]);

    // Format the response
    const formattedResponse = categoryData.map((item) => ({
      category: item._id,
      count: item.itemCount,
    }));

    res.json(formattedResponse);
  } catch (error) {
    console.error("Error fetching category distribution:", error);
    res.status(500).json({ message: "Error fetching category distribution" });
  }
};

const getCombinedData = async (req, res) => {
  const { month, search = "", page = 1, perPage = 10 } = req.query;

  try {
    // Call each of the APIs with the required parameters
    const [statisticsResponse, priceRangeResponse, categoryResponse] =
      await Promise.all([
        calculateStatistics({ query: { month } }, res),
        getPriceRangeDistribution({ query: { month } }, res),
        getCategoryDistribution({ query: { month } }, res),
      ]);

    // Combine responses
    const combinedResponse = {
      statistics: statisticsResponse,
      priceRangeDistribution: priceRangeResponse,
      categoryDistribution: categoryResponse,
    };

    res.json(combinedResponse);
  } catch (error) {
    console.error("Error fetching combined data:", error);
    res.status(500).json({ message: "Error fetching combined data" });
  }
};

module.exports = {
  listTransactions,
  getStatistics,
  getPriceRangeDistribution,
  getCategoryDistribution,
  getCombinedData,
};
