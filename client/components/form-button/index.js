// components/Button.js
import React from 'react';

const Button = ({ type, label, disabled }) => {
  return (
    <button disabled={disabled} type={type}
            className={disabled ? "w-full bg-gray-300 text-white py-2 rounded-md" : "w-full bg-blue-500 text-white py-2 rounded-md"}>
      {label}
    </button>
  );
};

export default Button;
