import React from "react";
import { useTable, usePagination } from "react-table";

const TransactionTable = ({ transactions, page, onPageChange }) => {
  // Define columns for the react-table
  const columns = React.useMemo(
    () => [
      { Header: "Title", accessor: "title" },
      { Header: "Description", accessor: "description" },
      { Header: "Price", accessor: "price" },
      { Header: "Sold", accessor: (row) => (row.sold ? "Yes" : "No") },
      {
        Header: "Date of Sale",
        accessor: (row) => new Date(row.dateOfSale).toLocaleDateString(),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page: currentRows, // data for the current page
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: transactions,
      initialState: { pageIndex: page - 1, pageSize: 10 }, // Setting page index based on props
      manualPagination: true, // Handles pagination manually
      pageCount: Math.ceil(transactions.length / 10), // Example total pages
    },
    usePagination
  );

  // Update parent component's page state when local page index changes
  React.useEffect(() => {
    onPageChange(pageIndex + 1);
  }, [pageIndex, onPageChange]);

  return (
    <div>
      <table
        {...getTableProps()}
        style={{ width: "100%", border: "1px solid #ddd" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              style={{ borderBottom: "2px solid #ddd" }}
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  style={{ padding: "8px", textAlign: "left" }}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {currentRows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                style={{ borderBottom: "1px solid #ddd" }}
              >
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} style={{ padding: "8px" }}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={previousPage} disabled={!canPreviousPage}>
          Previous
        </button>{" "}
        <button onClick={nextPage} disabled={!canNextPage}>
          Next
        </button>
        <span style={{ marginLeft: "10px" }}>
          Page {pageIndex + 1} of {Math.ceil(transactions.length / 10)}
        </span>
      </div>
    </div>
  );
};

export default TransactionTable;
