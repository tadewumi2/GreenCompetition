import React from "react";

const DataVisualization = ({ data, indicator, country }) => {
  // Handle empty data
  if (!data || data.length === 0 || !indicator || !country) {
    return (
      <div className="no-data">
        <p>No data available for the selected indicator and country.</p>
      </div>
    );
  }

  // Filter out entries with null values
  const validData = data.filter((item) => item.value !== null);

  if (validData.length === 0) {
    return (
      <div className="no-data">
        <p>
          No valid data points available for the selected indicator and country.
        </p>
      </div>
    );
  }

  // Calculate the max value for scaling
  const maxValue = Math.max(
    ...validData.map((item) => parseFloat(item.value) || 0)
  );
  // Use a minimum value to prevent flat charts
  const effectiveMaxValue = maxValue <= 0 ? 100 : maxValue;

  // Get SDG color based on goal number
  const getSDGColor = (sdgNumber) => {
    const sdgColors = {
      1: "#E5243B",
      6: "#26BDE2",
      11: "#FD9D24",
      15: "#56C02B",
      2: "#DDA63A",
      7: "#FCC30B",
      12: "#BF8B2E",
      16: "#00689D",
      3: "#4C9F38",
      8: "#A21942",
      13: "#3F7E44",
      17: "#19486A",
      4: "#C5192D",
      9: "#FD6925",
      14: "#0A97D9",
      5: "#FF3A21",
      10: "#DD1367",
    };

    return sdgColors[sdgNumber] || "#888888";
  };

  return (
    <div className="visualization-container">
      <h2>{indicator.name}</h2>
      <h3>Country: {country.name}</h3>

      <div className="chart-outer-container">
        <div className="chart-container">
          {validData.map((item, index) => {
            const value = parseFloat(item.value) || 0;
            const height = (value / effectiveMaxValue) * 200; // 200px is max height

            return (
              <div className="bar-column" key={index}>
                <div className="bar-value">{value.toFixed(2)}</div>
                <div
                  className="bar"
                  style={{
                    height: `${Math.max(height, 2)}px`,
                    backgroundColor: getSDGColor(indicator.sdg),
                  }}
                ></div>
                <div className="bar-label">{item.date}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="chart-legend">
        <p>
          SDG {indicator.sdg} Indicator: {indicator.name}
        </p>
        <p>Data shown for years with available measurements</p>
      </div>
    </div>
  );
};

export default DataVisualization;
