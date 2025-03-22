import React from "react";

const Header = () => {
  const headerStyle = {
    backgroundColor: "#4a9f9b",
    color: "white",
    padding: "1rem",
    textAlign: "center",
    borderRadius: "5px",
    marginBottom: "20px",
  };

  return (
    <header style={headerStyle}>
      <h1>Sustainable Development Goals Tracker</h1>
      <p>Tracking global progress towards a sustainable future</p>
    </header>
  );
};

export default Header;
