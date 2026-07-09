import React from 'react';

const CustomSelectStyles = () => {
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? '#FFFFFF' : provided.color,
      backgroundColor: state.isSelected ? '#ff6700' : provided.backgroundColor,
      zIndex: 999,
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: 'black',
      zIndex: 999,
    }),
  };

  return customStyles;
};

export default CustomSelectStyles;
