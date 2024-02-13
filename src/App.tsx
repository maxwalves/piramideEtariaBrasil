import React, { useState } from 'react';
import PopulationPyramidChart from './PopulationPyramidChart';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [selectedYear, setSelectedYear] = useState('2022');

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(event.target.value);
  };

  // Objeto com os URLs para cada ano
  const apiUrls: Record<string, string> = {
    '2022': 'https://servicodados.ibge.gov.br/api/v3/agregados/9514/periodos/-6/variaveis/93?localidades=N1[all]&classificacao=2[4,5]|287[93070,93084,93085,93086,93087,93088,93089,93090,93091,93092,93093,93094,93095,93096,93097,93098,49108,49109,60040,60041,6653]|286[113635]',
    '2010': 'https://servicodados.ibge.gov.br/api/v3/agregados/200/periodos/2010/variaveis/93?localidades=N1[all]&classificacao=2[4,5]|1[0]|58[1140,1141,1142,1143,1144,1145,1146,1147,1148,1149,1150,1151,1152,1153,1154,1155,6802,6803,92963,92964,92965]',
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="mb-4">Brazilian Age Pyramid</h1>

          {/* Select para escolher o ano */}
          <div className="mb-3">
            <label htmlFor="yearSelect" className="form-label">Select Year:</label>
            <select id="yearSelect" className="form-select" value={selectedYear} onChange={handleYearChange}>
              {Object.keys(apiUrls).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* PopulationPyramidChart com URL dinâmico baseado no ano selecionado */}
          <PopulationPyramidChart
            width="800px"
            height="600px"
            apiUrl={apiUrls[selectedYear]}
            ano = {selectedYear}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
