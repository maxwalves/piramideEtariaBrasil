import React, { useState, useEffect } from 'react';
import PopulationPyramidChart from './PopulationPyramidChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  // State variables for selected year and API URLs
  const [selectedYear, setSelectedYear] = useState('2022');
  const [apiUrls, setApiUrls] = useState<{ year: string; url: string; }[]>([]);

  // Fetch census data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch census data from the API
        const response = await axios.get('http://localhost:3333/censo');
        // Set API URLs in state based on fetched data
        setApiUrls(response.data.map((censo: { year: string; url: string; }) => ({
          year: censo.year,
          url: censo.url
        })));
      } catch (error) {
        // Log error if fetching data fails
        console.error('Error while fetching census data:', error);
      }
    };

    // Call fetchData function on component mount
    fetchData();
  }, []);

  // Function to handle year change in the select input
  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  // Render the component
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">Brazilian Age Pyramid</h1>

          <div className="mb-3">
            {/* Year selection dropdown */}
            <label htmlFor="yearSelect" className="form-label">Select Year:</label>
            <select id="yearSelect" className="form-select" value={selectedYear} onChange={handleYearChange}>
              {/* Render options for each year */}
              {apiUrls.map((obj) => (
                <option key={obj.year} value={obj.year}>{obj.year}</option>
              ))}
            </select>
          </div>

          {/* Render population pyramid chart if API URLs are available */}
          {apiUrls.length > 0 && (
            <PopulationPyramidChart
              width="800px"
              height="600px"
              // Pass selected year and corresponding API URL to the chart component
              apiUrl={apiUrls.find(obj => obj.year === selectedYear)?.url ?? ''}
              year={selectedYear}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
