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

  // Calculate the max value for scaling
  const maxValue = Math.max(...validData.map((item) => item.value));

  // If all values are 0 or invalid, set a default max
  const effectiveMaxValue = maxValue <= 0 ? 100 : maxValue;

  const chartContainerStyle = {
    marginTop: "20px",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const chartStyle = {
    display: "flex",
    height: "300px",
    alignItems: "flex-end",
    borderBottom: "2px solid #ddd",
    borderLeft: "2px solid #ddd",
    paddingTop: "20px",
    gap: "5px", // Add space between bars
  };

  const barContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flex: "1 0 auto",
    minWidth: "30px",
    maxWidth: "60px",
  };

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

  // Generate bars for chart
  const generateBars = () => {
    return validData.map((item, index) => {
      // Make sure we have a positive height value by using Math.max
      const heightPercentage = Math.max(
        5,
        (item.value / effectiveMaxValue) * 100
      );

      const barStyle = {
        height: `${heightPercentage}%`, // Use percentage height
        width: "80%",
        backgroundColor: getSDGColor(indicator.sdg),
        borderRadius: "4px 4px 0 0",
        transition: "height 0.5s ease, background-color 0.3s ease",
        position: "relative",
        minHeight: "5px", // Ensure there's always at least a visible bar
      };

      const labelStyle = {
        transform: "rotate(-45deg)",
        fontSize: "12px",
        marginTop: "8px",
        whiteSpace: "nowrap",
      };

      const valueStyle = {
        position: "absolute",
        top: "-25px",
        fontSize: "12px",
        fontWeight: "bold",
      };

      return (
        <div key={index} style={barContainerStyle} className="bar-container">
          <div style={barStyle} className="data-bar">
            <span style={valueStyle}>{item.value.toFixed(2)}</span>
          </div>
          <div style={labelStyle}>{item.date}</div>
        </div>
      );
    });
  };

  return (
    <div style={chartContainerStyle}>
      <h2>{indicator.name}</h2>
      <h3>Country: {country.name}</h3>
      <div className="chart-container">
        <div style={chartStyle} className="chart">
          {generateBars()}
        </div>
        <div
          className="axis-label"
          style={{ textAlign: "center", marginTop: "30px" }}
        >
          Year
        </div>
      </div>
      <div className="chart-legend" style={{ marginTop: "20px" }}>
        <p>
          SDG {indicator.sdg} Indicator: {indicator.name}
        </p>
        <p>Data shown for years with available measurements</p>
      </div>
    </div>
  );
};

export default DataVisualization;
