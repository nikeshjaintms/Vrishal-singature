// src/ToastProvider.js
import React from 'react';
import { Toaster } from 'react-hot-toast';

function ToastProvider({ children }) {

  const toastOptions = {
    duration: 3000,
    style: {
      fontSize: '1rem',
    },
  };

  return (
    <>
      <Toaster toastOptions={toastOptions} />
      {children}
    </>
  );
}

export default ToastProvider;
