// components/Statistics.js

import React from 'react';

const Statistics = ({statistics, loading }) => {
  return (
    <div>
      <h2>Transaction Statistics</h2>

      {/* Display Statistics */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={styles.box}>
          <h3>Total Sale Amount</h3>
          <p>{loading ? 'Loading...' : `$${statistics.totalSaleAmount}`}</p>
        </div>
        <div style={styles.box}>
          <h3>Total Sold Items</h3>
          <p>{loading ? 'Loading...' : statistics.totalSoldItems}</p>
        </div>
        <div style={styles.box}>
          <h3>Total Not Sold Items</h3>
          <p>{loading ? 'Loading...' : statistics.totalNotSoldItems}</p>
        </div>
      </div>
    </div>
  );
};

// Inline styles for the boxes
const styles = {
  box: {
    flex: 1,
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '20px',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
  },
};

export default Statistics;
