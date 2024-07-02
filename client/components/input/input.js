// components/Input.js
import React from 'react';

const Input = ({ label, id, type, value, onChange, min }) => {
  return (
    <div className="flex items-center">
      <label className="w-32 text-gray-700" htmlFor={id}>{label}:</label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        min={min}
        className="w-full border rounded px-3 py-2"
      />
    </div>
  );
};

export default Input;
