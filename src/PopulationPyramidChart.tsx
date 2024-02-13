import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    JSC?: {
      Chart: (element: HTMLElement, config: any) => void;
    };
  }
}


interface DataPoint {
  name: string;
  points: [string, number][];
}

interface PopulationPyramidChartProps {
  width?: string;
  height?: string;
  apiUrl: string;
  ano: string;
}

const PopulationPyramidChart: React.FC<PopulationPyramidChartProps> = ({ width = '100%', height = '100%', apiUrl, ano }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          apiUrl,
        );

        if (!response.ok) {
          throw new Error('Erro ao obter dados da API do IBGE');
        }

        const dados = await response.json();
        const dadosTratados = dados[0].resultados;

        const dadosParaGraficoHomens: [string, number][] = [];
        const dadosParaGraficoMulheres: [string, number][] = [];

        var codigoSexo = 0;
        var codigoGrupoIdade = 0;
        if(ano === '2022'){
          codigoSexo = 2;
          codigoGrupoIdade = 287;
        }
        else if(ano === '2010'){
          codigoSexo = 2;
          codigoGrupoIdade = 58;
        }

        for (let i = 0; i < dadosTratados.length; i++) {

          var sexoChave = '';
          var sexo = '';
          for (let j = 0; j < dadosTratados[i].classificacoes.length; j++) {
            if(dadosTratados[i].classificacoes[j].id == codigoSexo){

              const sexoChaveValor = dadosTratados[i].classificacoes[j].categoria;
              sexoChave = Object.keys(sexoChaveValor)[0];
              sexo = sexoChaveValor[sexoChave];

            }
          }

          var chaveGrupoIdade = '';
          var valorGrupoIdade = '';
          for (let j = 0; j < dadosTratados[i].classificacoes.length; j++) {
            if(dadosTratados[i].classificacoes[j].id == codigoGrupoIdade){

              const grupoIdadeChaveValor = dadosTratados[i].classificacoes[j].categoria;
              chaveGrupoIdade = Object.keys(grupoIdadeChaveValor)[0];
              valorGrupoIdade = grupoIdadeChaveValor[chaveGrupoIdade];

            }
          }

          const quantidadeChaveValor = dadosTratados[i].series[0].serie;
          const chaveQuantidade = Object.keys(quantidadeChaveValor)[0];
          var valorQuantidade = quantidadeChaveValor[chaveQuantidade];

          //garanta que o valorQuantidade é um número inteiro, converta ele
          //para um número inteiro
          valorQuantidade = parseInt(valorQuantidade, 10);

          if (sexo === 'Homens') {
            dadosParaGraficoHomens.push([valorGrupoIdade, -valorQuantidade]);
          }
          if (sexo === 'Mulheres') {
            dadosParaGraficoMulheres.push([valorGrupoIdade, valorQuantidade]);
          }
        }

        const homens: DataPoint = {
          name: 'Male',
          points: dadosParaGraficoHomens,
        };

        const mulheres: DataPoint = {
          name: 'Female',
          points: dadosParaGraficoMulheres,
        };

        if (window.JSC) {
          renderChart(homens, mulheres);
        } else {
          const script = document.createElement('script');
          script.src = 'https://code.jscharting.com/latest/jscharting.js';
          script.async = true;
          script.onload = () => renderChart(homens, mulheres);
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  const renderChart = (homens: DataPoint, mulheres: DataPoint) => {
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
      series: [homens, mulheres],
    };

    if (window.JSC && typeof window.JSC.Chart === 'function') {
      // Verifica se chartRef.current não é nulo antes de chamar a função Chart
      if (chartRef.current) {
        window.JSC.Chart(chartRef.current, config);
      } else {
        console.error('chartRef.current é nulo.');
      }
    } else {
      console.error('JSCharting.Chart não está definido ou não é uma função.');
    }
  };

  return <div ref={chartRef} style={{ width, height }}></div>;
};

export default PopulationPyramidChart;
