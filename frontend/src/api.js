import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/products";

export const fetchTransactions = (month, search, page, perPage) =>
  axios.get(`${API_BASE_URL}/transactions`, {
    params: { month, search, page, perPage },
  });

export const fetchStatistics = (month) =>
  axios.get(`${API_BASE_URL}/statistics`, { params: { month } });

export const fetchPriceRangeDistribution = (month) =>
  axios.get(`${API_BASE_URL}/price-range-distribution`, { params: { month } });

// export const fetchCategoryDistribution = (month) =>
//   axios.get(`${API_BASE_URL}/category-distribution`, { params: { month } });
