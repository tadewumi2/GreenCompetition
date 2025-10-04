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
  const [dataAvailable, setDataAvailable] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  //comment
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

        // Check if response has the expected format
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 1
        ) {
          // Filter out aggregates and regions, keep only countries
          const countryList = response.data[1].filter(
            (country) => country.region && country.region.value !== "Aggregates"
          );
          setCountries(countryList);
        } else {
          console.error("Unexpected API response format:", response.data);
          setError("Failed to parse countries data");
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch countries. Please try again later.");
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
    setError(null); // Reset error state
    setDataAvailable(true); // Reset data availability state

    try {
      // Expanded date range to capture more historical data
      const response = await axios.get(
        `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&per_page=100&date=2000:2024`
      );

      console.log(
        `Data for ${country}, indicator ${indicator}:`,
        response.data
      );

      // Check for pagination information
      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        const metadata = response.data[0];
        if (metadata.pages > 1) {
          console.log(
            `Note: Additional pages of data are available (${metadata.pages} total)`
          );
          // Consider implementing pagination handling here if needed
        }
      }

      if (
        response.data &&
        Array.isArray(response.data) &&
        response.data.length > 1 &&
        Array.isArray(response.data[1]) &&
        response.data[1].length > 0
      ) {
        // Filter out null values and sort data by date in ascending order
        const filteredData = response.data[1].filter(
          (item) => item.value !== null
        );

        if (filteredData.length > 0) {
          const sortedData = filteredData.sort(
            (a, b) => parseInt(a.date) - parseInt(b.date)
          );
          setIndicatorData(sortedData);
        } else {
          console.log(
            `No valid data points found for ${country}, indicator ${indicator}`
          );
          setIndicatorData([]);
          setDataAvailable(false);
        }
      } else {
        console.log(
          `Empty or invalid response for ${country}, indicator ${indicator}`
        );
        setIndicatorData([]);
        setDataAvailable(false);
      }

      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch data. Please try again later.`);
      setDataAvailable(false);
      setIndicatorData([]);
      setLoading(false);
      console.error(
        `Error fetching data for country ${country}, indicator ${indicator}:`,
        err
      );
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

  // Get the current country and indicator objects
  const currentCountry = countries.find((c) => c.id === selectedCountry);
  const currentIndicator = indicators.find(
    (ind) => ind.code === selectedIndicator
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

          {!dataAvailable ? (
            <div className="no-data-message">
              <p>
                No data available for{" "}
                {currentCountry ? currentCountry.name : "selected country"}
                on{" "}
                {currentIndicator
                  ? currentIndicator.name
                  : "selected indicator"}
                .
              </p>
              <p>Try selecting a different country or indicator.</p>
            </div>
          ) : (
            <DataVisualization
              data={indicatorData}
              indicator={currentIndicator}
              country={currentCountry}
            />
          )}
        </>
      )}
    </div>
  );
};

export default App;
