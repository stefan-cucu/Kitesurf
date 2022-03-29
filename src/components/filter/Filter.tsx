/*
 * Custom filter settings component
 */
import React from "react";
import filterImg from "../../assets/filter.png";
import "./Filter.css";

// Props type for the filter component
export interface IFilter {
  country: string;
  probability: number;
  setCountry: (country: string) => void;
  setProbability: (probability: number) => void;
}

const Filter: React.FC<IFilter> = (props) => {
  const [filterToggle, setFilterToggle] = React.useState(false);

  return (
    <>
      {
        // Filter button
        !filterToggle && (
          <button
            className="filter-btn-toggle"
            onClick={() => setFilterToggle(true)}
          >
            <img src={filterImg} alt="filter" />
            <p>Filter</p>
          </button>
        )
      }
      {
        // Filter settings
        filterToggle && (
          <div className="filter-container">
            <button
              className="filter-btn-close"
              onClick={() => {
                setFilterToggle(false);
              }}
            >
              x
            </button>
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              name="country"
              value={props.country}
              onChange={(e) => props.setCountry(e.target.value)}
            />
            <label htmlFor="probability">Wind Probability:</label>
            <input
              type="number"
              name="probability"
              value={props.probability}
              min={0}
              max={100}
              onChange={(e) => props.setProbability(parseInt(e.target.value))}
            />
            <button
              className="filter-btn"
              onClick={() => {
                props.setCountry("");
                props.setProbability(0);
              }}
            >
              Clear Filter
            </button>
          </div>
        )
      }
    </>
  );
};

export default Filter;
