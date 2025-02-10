// components/employee/AddressField.jsx
export const AddressField = ({ addressData, onChange, onAddressClick }) => {
  return (
    <div className="address-row">
      <div className="address-main">
        <FormField
          name="address"
          label="기본주소"
          value={addressData.address}
          readOnly
        />
        <button
          type="button"
          onClick={onAddressClick}
          className="address-search-btn"
        >
          주소 검색
        </button>
      </div>
      <div className="address-sub">
        <FormField
          name="detailAddress"
          label="상세주소"
          value={addressData.detailAddress}
          onChange={onChange}
        />
        <FormField
          name="zipCode"
          label="우편번호"
          value={addressData.zipCode}
          readOnly
          className="zipcode-input"
        />
      </div>
    </div>
  );
};
