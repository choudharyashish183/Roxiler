import React, { useState, useEffect } from "react";
import {
  fetchStatistics,
  fetchTransactions,
  fetchPriceRangeDistribution,
} from "./api";
import MonthDropdown from "./components/MonthDropdown";
import SearchBox from "./components/SearchBox";
import TransactionTable from "./components/TransactionTable";
import Statistics from "./components/Statistics";
import PriceDistributionChart from "./components/PriceDistributionChart";

function App() {
  const [month, setMonth] = useState("March");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [priceDistributionData, setPriceDistributionData] = useState([]);

  useEffect(() => {
    // Load data within useEffect directly
    const loadData = async () => {
      try {
        const transactionRes = await fetchTransactions(month, search, page, 10);
        setTransactions(transactionRes.data.products || []);

        const statsRes = await fetchStatistics(month);
        setStatistics(
          statsRes.data || {
            totalSaleAmount: 0,
            totalSoldItems: 0,
            totalNotSoldItems: 0,
          }
        );

        const priceDistributionRes = await fetchPriceRangeDistribution(month)
        setPriceDistributionData(priceDistributionRes.data || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [month, search, page]);

  return (
    <div className="App">
      <h1>Transaction Dashboard</h1>
      <MonthDropdown selectedMonth={month} onChange={setMonth} />
      <SearchBox onSearch={setSearch} />
      <TransactionTable
        transactions={transactions}
        page={page}
        onPageChange={setPage}
      />
      <h2>Statistics</h2>
      <Statistics statistics={statistics} />
      <PriceDistributionChart data={priceDistributionData} month={month} />
    </div>
  );
}

export default App;
