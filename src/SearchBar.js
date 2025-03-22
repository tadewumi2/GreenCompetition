import React from "react";

const SearchBar = ({
  searchTerm,
  onSearchChange,
  countries,
  indicators,
  onCountryChange,
  onIndicatorChange,
  selectedCountry,
  selectedIndicator,
}) => {
  // Destructuring props for clean usage

  const searchBarStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "15px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    marginBottom: "20px",
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    fontSize: "16px",
  };

  const selectStyle = {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    fontSize: "16px",
  };

  const rowStyle = {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  };

  return (
    <div style={searchBarStyle}>
      <div style={rowStyle}>
        <div style={{ flex: 1 }}>
          <label htmlFor="country-search">Search Countries:</label>
          <input
            type="text"
            id="country-search"
            placeholder="Search for a country..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label htmlFor="country-select">Select Country:</label>
          <select
            id="country-select"
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            style={selectStyle}
          >
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="indicator-select">
          Select Sustainability Indicator:
        </label>
        <select
          id="indicator-select"
          value={selectedIndicator}
          onChange={(e) => onIndicatorChange(e.target.value)}
          style={selectStyle}
        >
          {indicators.map((indicator) => (
            <option key={indicator.code} value={indicator.code}>
              {indicator.name} (SDG {indicator.sdg})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
