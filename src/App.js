import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";
import Header from "./Header";
import SearchBar from "./SearchBar";
import SDGDashboard from "./SDGDashboard";
import DataVisualization from "./DataVisualization";

// Import MVP.css
import "mvp.css";

const App = () => {
  // State variables
  const [indicators, setIndicators] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("WLD"); // World as default
  const [selectedIndicator, setSelectedIndicator] = useState("");
  const [indicatorData, setIndicatorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Define the sustainable development indicator codes we're interested in
  const sdgIndicators = [
    {
      code: "EN.ATM.CO2E.PC",
      name: "CO2 emissions (metric tons per capita)",
      sdg: 13,
    },
    {
      code: "EG.USE.ELEC.KH.PC",
      name: "Electric power consumption (kWh per capita)",
      sdg: 7,
    },
    {
      code: "ER.H2O.FWTL.ZS",
      name: "Renewable freshwater resources per capita",
      sdg: 6,
    },
    { code: "AG.LND.FRST.ZS", name: "Forest area (% of land area)", sdg: 15 },
    {
      code: "SH.STA.BASS.ZS",
      name: "People using at least basic sanitation services",
      sdg: 6,
    },
    {
      code: "EN.POP.SLUM.UR.ZS",
      name: "Urban population living in slums",
      sdg: 11,
    },
  ];

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(
          "https://api.worldbank.org/v2/country?format=json&per_page=300"
        );
        // Filter out aggregates and regions, keep only countries
        const countryList = response.data[1].filter(
          (country) => country.region.value !== "Aggregates"
        );
        setCountries(countryList);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch countries");
        setLoading(false);
        console.error("Error fetching countries:", err);
      }
    };

    fetchCountries();
    setIndicators(sdgIndicators);
    // Set a default indicator
    if (sdgIndicators.length > 0) {
      setSelectedIndicator(sdgIndicators[0].code);
    }
  }, []);

  // Fetch indicator data when country or indicator changes
  useEffect(() => {
    if (selectedCountry && selectedIndicator) {
      fetchIndicatorData(selectedCountry, selectedIndicator);
    }
  }, [selectedCountry, selectedIndicator]);

  const fetchIndicatorData = async (country, indicator) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&per_page=60&date=2000:2022`
      );

      if (response.data && response.data[1]) {
        // Sort data by date in ascending order
        const sortedData = response.data[1].sort(
          (a, b) => parseInt(a.date) - parseInt(b.date)
        );
        setIndicatorData(sortedData);
      } else {
        setIndicatorData([]);
      }
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch data for indicator ${indicator}`);
      setLoading(false);
      console.error("Error fetching indicator data:", err);
    }
  };

  // Handle country selection
  const handleCountryChange = (countryCode) => {
    setSelectedCountry(countryCode);
  };

  // Handle indicator selection
  const handleIndicatorChange = (indicatorCode) => {
    setSelectedIndicator(indicatorCode);
  };

  // Handle search term change
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Filter countries based on search term
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-container">
      <Header />
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        countries={filteredCountries}
        indicators={indicators}
        onCountryChange={handleCountryChange}
        onIndicatorChange={handleIndicatorChange}
        selectedCountry={selectedCountry}
        selectedIndicator={selectedIndicator}
      />

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <>
          <SDGDashboard
            indicators={indicators}
            selectedIndicator={selectedIndicator}
            onIndicatorChange={handleIndicatorChange}
          />
          <DataVisualization
            data={indicatorData}
            indicator={indicators.find((ind) => ind.code === selectedIndicator)}
            country={countries.find((c) => c.id === selectedCountry)}
          />
        </>
      )}
    </div>
  );
};

export default App;
