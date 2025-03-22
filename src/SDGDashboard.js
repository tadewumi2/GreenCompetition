import React from "react";
import SDGCard from "./SDGCard";

const SDGDashboard = ({ indicators, selectedIndicator, onIndicatorChange }) => {
  // Define SDG colors
  const sdgColors = {
    1: "#E5243B", // No Poverty
    2: "#DDA63A", // Zero Hunger
    3: "#4C9F38", // Good Health and Well-being
    4: "#C5192D", // Quality Education
    5: "#FF3A21", // Gender Equality
    6: "#26BDE2", // Clean Water and Sanitation
    7: "#FCC30B", // Affordable and Clean Energy
    8: "#A21942", // Decent Work and Economic Growth
    9: "#FD6925", // Industry, Innovation and Infrastructure
    10: "#DD1367", // Reduced Inequalities
    11: "#FD9D24", // Sustainable Cities and Communities
    12: "#BF8B2E", // Responsible Consumption and Production
    13: "#3F7E44", // Climate Action
    14: "#0A97D9", // Life Below Water
    15: "#56C02B", // Life on Land
    16: "#00689D", // Peace, Justice and Strong Institutions
    17: "#19486A", // Partnerships for the Goals
  };

  const dashboardStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "15px",
    marginBottom: "30px",
  };

  return (
    <div>
      <h2>Sustainable Development Goals</h2>
      <div style={dashboardStyle}>
        {indicators.map((indicator) => (
          <SDGCard
            key={indicator.code}
            indicator={indicator}
            isSelected={indicator.code === selectedIndicator}
            onSelect={() => onIndicatorChange(indicator.code)}
            color={sdgColors[indicator.sdg]}
          />
        ))}
      </div>
    </div>
  );
};

export default SDGDashboard;
