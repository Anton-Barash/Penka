import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import axios from "axios";

function CandlestickChart(props) {
  const [candlestickData, setCandlestickData] = useState(null);

  const fetchCandlestickData = (symbol) => {
    const baseUrl = "https://api.binance.com";
    const endPoint = "/api/v3/klines";
    const interval = "1w"; // интервал недели
    const currentTime = new Date().getTime(); // текущее время в миллисекундах
    const startTime = currentTime - 50 * 7 * 24 * 60 * 60 * 1000; // время начала (50 недели назад)
    const endTime = currentTime; // текущее время

    axios
      .get(
        `${baseUrl}${endPoint}?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
      )
      .then((response) => {
        // Получите данные из ответа
        const responseData = response.data;
        console.log(responseData);
        // Преобразуйте данные в формат, подходящий для графика со свечками
        const formattedData = responseData.map((item) => ({
          x: new Date(item[0]),
          y: [
            parseFloat(item[1]),
            parseFloat(item[2]),
            parseFloat(item[3]),
            parseFloat(item[4]),
          ],
          volume: parseFloat(item[5]), // добавляем данные о объеме торгов
        }));

        // Установите полученные данные в состояние
        console.log(formattedData);
        setCandlestickData(formattedData);
      })
      .catch((error) => {
        console.error("Ошибка при выполнении GET-запроса:", error);
      });
  };

  useEffect(() => {
    // Вызовите функцию fetchCandlestickData при изменении значения symbol в props
    fetchCandlestickData(props.symbol);
  }, [props.symbol]);

  const options = {
    title: {
      text: props.symbol,
      align: "left",
    },
    xaxis: {
      type: "datetime",
    },

    yaxis: [
      {
        tooltip: {
          enabled: true,
        },
        labels: {
          formatter: function (value) {
            return value ? value.toFixed(4) + " $" : 0;
          },
        },
      },
      {
        seriesName: "Volume",
        opposite: true,
        title: {
          text: "Volume",
        },
        labels: {
          formatter: function (value) {
            return value / 1000000 + " m";
          },
        },
      },
    ],
  };

  return (
    <div style={{ background: "#ffffff" }}>
      {candlestickData && (
        <Chart
          type="candlestick"
          height={400}
          options={options}
          series={[
            { name: "price", type: "candlestick", data: candlestickData },
            {
              name: "Volume",
              type: "column",

              data: candlestickData.map((item) => ({
                x: item.x,
                y: item.volume,
              })),
            },
          ]}
        />
      )}
    </div>
  );
}

export default CandlestickChart;
