import React, { useState, useEffect } from 'react';
import PopulationPyramidChart from './PopulationPyramidChart';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function App() {
  const [selectedYear, setSelectedYear] = useState('2022');
  const [apiUrls, setApiUrls] = useState<{ ano: string; url: string; }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3333/censo');
        setApiUrls(response.data.map((censo: { year: string; url: string; }) => ({
          ano: censo.year,
          url: censo.url
        })));
      } catch (error) {
        console.error('Erro ao buscar os dados do censo:', error);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">Brazilian Age Pyramid</h1>

          <div className="mb-3">
            <label htmlFor="yearSelect" className="form-label">Select Year:</label>
            <select id="yearSelect" className="form-select" value={selectedYear} onChange={handleYearChange}>
              {apiUrls.map((obj) => (
                <option key={obj.ano} value={obj.ano}>
                  {obj.ano}
                </option>
              ))}
            </select>
          </div>

          {apiUrls.length > 0 && (
            <PopulationPyramidChart
              width="800px"
              height="600px"
              apiUrl={apiUrls.find(obj => obj.ano === selectedYear)?.url ?? ''}
              ano={selectedYear}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
