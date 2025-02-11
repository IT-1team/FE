import React from "react";
import { FormField } from "../common/InputField";
import { AddressField } from "./AddressField";

// components/employee/EmployeeForm.jsx
export const EmployeeForm = ({
  employeeData,
  onChange,
  onSubmit,
  onAddressClick,
  onExcelClick,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        {FormField.map((row, rowIndex) => (
          <div key={rowIndex} className="form-row">
            {row.map((field) => (
              <FormField
                key={field.name}
                {...field}
                value={employeeData[field.name]}
                onChange={onChange}
              />
            ))}
          </div>
        ))}

        <AddressField
          addressData={employeeData}
          onChange={onChange}
          onAddressClick={onAddressClick}
        />
      </div>

      <div className="button-group">
        <button type="button" onClick={onExcelClick} className="excel-btn">
          Excel 등록
        </button>
        <button type="submit" className="submit-btn">
          사원 등록
        </button>
      </div>
    </form>
  );
};
