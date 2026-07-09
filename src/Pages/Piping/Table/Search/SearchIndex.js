import React from 'react';

const SearchIndex = ({ onSearch, value = "" }) => {

  const onInputChange = (value) => {
    onSearch(value);
  };

  return (
    <input
      type="text"
      className="form-control"
      placeholder="Search here"
      value={value}
      onChange={(e) => onInputChange(e.target.value)}
    />
  );
};

export default SearchIndex;