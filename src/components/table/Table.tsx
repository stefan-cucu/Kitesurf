/*
 * Custom table component 
 */
import React from "react";
import { useSelector } from "react-redux";
import { Spot, getSpots } from "../../store/Spot";
import arrowImg from "../../assets/arrowhead.png";
import arrowOnImg from "../../assets/arrowhead-on.png";
import "./Table.css";

// Table head data
const columns = ["name", "country", "lat", "long", "probability", "month"];
const columnNames = [
  "Name",
  "Country",
  "Latitude",
  "Longitude",
  "Wind Prob.",
  "When to go",
];

// Props type for the table component
export interface TableProps {
  filter: string;
}

const Table: React.FC<TableProps> = (props) => {
  let spots = useSelector(getSpots);
  const nrPages = Math.ceil(spots.length / 10);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [sortColumn, setSortColumn] = React.useState("name");
  const [sortDirection, setSortDirection] = React.useState("asc");

  // Process the spots data
  const getData = () => {
    let data = spots;
    return data
      .filter((row: Spot) => row.name.includes(props.filter))
      .sort((a: Spot, b: Spot) => {
        if (sortDirection === "asc") {
          return a[sortColumn as keyof Spot] > b[sortColumn as keyof Spot]
            ? 1
            : -1;
        } else {
          return a[sortColumn as keyof Spot] < b[sortColumn as keyof Spot]
            ? 1
            : -1;
        }
      })
      .slice(currentPage * 10 - 10, currentPage * 10);
  };
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>
                <div className="table-cell">
                  <p>{columnNames[index]}</p>
                  <div className="order-controls">
                    <img
                      src={
                        sortDirection === "asc" && sortColumn === column
                          ? arrowOnImg
                          : arrowImg
                      }
                      alt="arrow"
                      onClick={() => {
                        setSortColumn(column);
                        setSortDirection("asc");
                      }}
                    />
                    <img
                      src={
                        sortDirection === "desc" && sortColumn === column
                          ? arrowOnImg
                          : arrowImg
                      }
                      alt="arrow"
                      onClick={() => {
                        setSortColumn(column);
                        setSortDirection("desc");
                      }}
                    />
                  </div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {getData().map((spot: Spot, index: number) => (
            <tr key={index}>
              <td>
                <p>{spot.name}</p>
              </td>
              <td>
                <p>{spot.country}</p>
              </td>
              <td>
                <p>{spot.lat}</p>
              </td>
              <td>
                <p>{spot.long}</p>
              </td>
              <td>
                <p>{spot.probability}%</p>
              </td>
              <td>
                <p>{spot.month}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <button
          className="page-button"
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
        >
          {"<"}
        </button>
        <button
          className="page-button"
          onClick={() =>
            setCurrentPage(currentPage < nrPages ? currentPage + 1 : nrPages)
          }
        >
          {">"}
        </button>
        <p>
          Page {currentPage} of {nrPages}
        </p>
      </div>
    </div>
  );
};

export default Table;
