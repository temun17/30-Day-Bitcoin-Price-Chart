import React from "react";
import "./SearchBox.css";

const SearchBox = ({ searchChange }) => {
  return (
    <div className="search pa2">
      <input
        className="pa2 ba b--green bg-lightest-blue searchBox"
        type="search"
        placeholder={`Try "Jan 01"...`}
        onChange={searchChange}
      />
    </div>
  );
};

export default SearchBox;
