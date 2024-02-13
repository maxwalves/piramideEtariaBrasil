import React, { useEffect, useRef } from 'react';

// Declare additional properties on the global window object for JSCharting
declare global {
  interface Window {
    JSC?: {
      Chart: (element: HTMLElement, config: any) => void;
    };
  }
}

// Define interfaces for data points and component props
interface DataPoint {
  name: string;
  points: [string, number][];
}

interface PopulationPyramidChartProps {
  width?: string;
  height?: string;
  apiUrl: string;
  year: string;
}

// Define the PopulationPyramidChart component
const PopulationPyramidChart: React.FC<PopulationPyramidChartProps> = ({ width = '100%', height = '100%', apiUrl, year }) => {
  // Ref to hold reference to the chart container element
  const chartRef = useRef<HTMLDivElement>(null);

  // Fetch data from the provided API URL on component mount or when apiUrl changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the provided API URL
        const response = await fetch(apiUrl);

        // Check if the response is ok
        if (!response.ok) {
          throw new Error('Error when obtaining date from the IBGE API');
        }

        // Parse response data
        const data = await response.json();
        const dataProcessed = data[0].resultados;

        // Variables to hold data for chart
        const dataChartMen: [string, number][] = [];
        const dataChartWomen: [string, number][] = [];

        // Determine codes for sex and age group based on selected year
        var codeSex = 0;
        var codeGroupAge = 0;
        if(year === '2022'){
          codeSex = 2;
          codeGroupAge = 287;
        }
        else if(year === '2010'){
          codeSex = 2;
          codeGroupAge = 58;
        }

        // Process retrieved data
        for (let i = 0; i < dataProcessed.length; i++) {
          var sexKey = '';
          var sex = '';
          // Extract sex information from the data
          for (let j = 0; j < dataProcessed[i].classificacoes.length; j++) {
            if(dataProcessed[i].classificacoes[j].id == codeSex){
              const sexKeyValue = dataProcessed[i].classificacoes[j].categoria;
              sexKey = Object.keys(sexKeyValue)[0];
              sex = sexKeyValue[sexKey];
            }
          }

          var keyGroupAge = '';
          var valueGroupAge = '';
          // Extract age group information from the data
          for (let j = 0; j < dataProcessed[i].classificacoes.length; j++) {
            if(dataProcessed[i].classificacoes[j].id == codeGroupAge){
              const grupoIdadeChaveValor = dataProcessed[i].classificacoes[j].categoria;
              keyGroupAge = Object.keys(grupoIdadeChaveValor)[0];
              valueGroupAge = grupoIdadeChaveValor[keyGroupAge];
              valueGroupAge = valueGroupAge.replace(' anos', ' years');
              valueGroupAge = valueGroupAge.replace(' ou mais', ' or more');
            }
          }

          // Extract quantity information from the data
          const amountKeyValue = dataProcessed[i].series[0].serie;
          const keyAmount = Object.keys(amountKeyValue)[0];
          var valueAmount = amountKeyValue[keyAmount];
          valueAmount = parseInt(valueAmount, 10);

          // Determine if the data belongs to males or females and push to respective arrays
          if (sex === 'Homens') {
            dataChartMen.push([valueGroupAge, -valueAmount]);
          }
          if (sex === 'Mulheres') {
            dataChartWomen.push([valueGroupAge, valueAmount]);
          }
        }

        // Create data points for males and females
        const dataMen: DataPoint = {
          name: 'Male',
          points: dataChartMen,
        };

        const dataWomen: DataPoint = {
          name: 'Female',
          points: dataChartWomen,
        };

        // Render chart using JSCharting library
        if (window.JSC) {
          renderChart(dataMen, dataWomen);
        } else {
          // Load JSCharting library if not already loaded
          const script = document.createElement('script');
          script.src = 'https://code.jscharting.com/latest/jscharting.js';
          script.async = true;
          script.onload = () => renderChart(dataMen, dataWomen);
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    // Call fetchData function on component mount or when apiUrl changes
    fetchData();
  }, [apiUrl]);

  // Function to render the population pyramid chart
  const renderChart = (dataMen: DataPoint, dataWomen: DataPoint) => {
    // Reverse data points to display correctly on the chart
    dataMen.points.reverse();
    dataWomen.points.reverse();

    // Configuration object for the chart
    const config = {
      debug: true,
      type: 'horizontal column',
      title_label_text: '',
      yAxis: {
        scale_type: 'stacked',
        defaultTick_label_text: '{Math.abs(%Value):a2}',
      },
      xAxis: { label_text: 'Age', crosshair_enabled: true },
      defaultTooltip_label_text: 'Ages %xValue:<br><b>%points</b>',
      defaultPoint_tooltip: '%icon {Math.abs(%Value)}',
      legend_template: '%name %icon {Math.abs(%Value)}',
      series: [dataMen, dataWomen],
    };

    // Render the chart using JSCharting library
    if (window.JSC && typeof window.JSC.Chart === 'function') {
      // Check if chartRef.current is not null before calling the Chart function
      if (chartRef.current) {
        window.JSC.Chart(chartRef.current, config);
      } else {
        console.error('chartRef.current is null.');
      }
    } else {
      console.error('JSCharting.Chart is not defined or is not a function.');
    }
  };

  // Render the chart container
  return <div ref={chartRef} style={{ width, height }}></div>;
};

// Export the PopulationPyramidChart component
export default PopulationPyramidChart;
