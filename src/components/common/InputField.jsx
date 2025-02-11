import React from "react";

export const InputField = ({ label, name, value, onChange, type = "text" }) => {
  return (
    <div className={`form-group ${name}`}>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e)}
      />
    </div>
  );
};