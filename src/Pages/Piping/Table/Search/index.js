import React, { useState } from 'react';

const Search = ({ onSearch, value = "" }) => {
  const [localSearch, setLocalSearch] = useState(value);

  // Sync internal state with prop
  React.useEffect(() => {
    setLocalSearch(value);
  }, [value]);

  const onInputChange = (val) => {
    setLocalSearch(val);
    onSearch(val);
  };
  return (
    <input
      type="text"
      className="form-control"
      placeholder="Search here"
      value={localSearch}
      onChange={(e) => onInputChange(e.target.value)}
    />
  );
};

export default Search;