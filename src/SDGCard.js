import React from "react";

const SDGCard = ({ indicator, isSelected, onSelect, color }) => {
  // Destructuring props for clean usage

  const cardStyle = {
    backgroundColor: isSelected ? color : "#ffffff",
    color: isSelected ? "#ffffff" : "#333333",
    border: `2px solid ${color}`,
    borderRadius: "8px",
    padding: "15px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    minHeight: "120px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const titleStyle = {
    marginTop: 0,
    fontSize: "0.9rem",
    fontWeight: "bold",
  };

  const sdgBadgeStyle = {
    backgroundColor: color,
    color: "white",
    borderRadius: "50%",
    width: "30px",
    height: "30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    marginLeft: "auto",
  };

  return (
    <div
      style={cardStyle}
      onClick={onSelect}
      className={isSelected ? "selected-card" : ""}
    >
      <div style={sdgBadgeStyle}>{indicator.sdg}</div>
      <h3 style={titleStyle}>{indicator.name}</h3>
    </div>
  );
};

export default SDGCard;
