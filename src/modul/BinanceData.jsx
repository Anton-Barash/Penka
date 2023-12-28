import React, { useState, useEffect } from "react";
import axios from "axios";
import CandlestickChart from "./CandlestickChart";

function BinanceData() {
  const [minPrices, setMinPrices] = useState({});
  const [maxPrices, setMaxPrices] = useState({});
  const [weeks, setWeeks] = useState(4); // По умолчанию 4 недели
  const [usdPairs, setUsdPairs] = useState([]);
  const [changeThreshold, setChangeThreshold] = useState(6);
  const baseUrl = "https://api.binance.com";
  const endPoint = "/api/v3/klines";
  const interval = "1w"; // интервал недели
  const currentTime = new Date().getTime(); // текущее время в миллисекундах
  const startTime = currentTime - weeks * 7 * 24 * 60 * 60 * 1000; // время начала (4 недели назад)
  const endTime = currentTime; // текущее время
  const [symbol, setSymbol] = useState("TUSDUSDT");

  const excludedPairs = [
    "TUSDUSDT",
    "USDCUSDT",
    "BUSDUSDT",
    "USDPUSDT",
    "FDUSDUSDT",
    "GBPUSDT",
    "EURUSDT",
  ];

  useEffect(() => {
    // Запрос для получения списка всех торговых пар с USDT
    axios
      .get(`${baseUrl}/api/v3/exchangeInfo`)
      .then((response) => {
        console.log(response.data.symbols);
        const usdtPairs = response.data.symbols.filter(
          (pair) =>
            pair.symbol.endsWith("USDT") && !excludedPairs.includes(pair.symbol)
        );

        setUsdPairs(usdtPairs);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  useEffect(() => {
    // Получение данных за последние weks недели с использованием Axios
    usdPairs.forEach((pair) => {
      axios
        .get(
          `${baseUrl}${endPoint}?symbol=${pair.symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
        )
        .then((response) => {
          let lowestLow = Number.MAX_VALUE;
          let highestHigh = 0;

          for (const data of response.data) {
            const lowPrice = parseFloat(data[3]);
            const highPrice = parseFloat(data[2]);
            if (lowPrice < lowestLow) {
              lowestLow = lowPrice;
            }
            if (highPrice > highestHigh) {
              highestHigh = highPrice;
            }
          }
          setMinPrices((prev) => {
            return { ...prev, [pair.symbol]: lowestLow };
          });
          setMaxPrices((prev) => {
            return { ...prev, [pair.symbol]: highestHigh };
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, [weeks, usdPairs]);
  return (
    <div style={{ marginTop: "5rem" }}>
      <h2>
        Пенка!
        Исторические данные объема торговли за последние {weeks} недель(и)
      </h2>
      <label>
        Выберите количество недель:
        <input
          type="number"
          value={weeks}
          onChange={(e) => setWeeks(e.target.value)}
        />
      </label>
      <label>
        Укажите пороговое значение Процентного изменения (%):
        <input
          type="number"
          value={changeThreshold}
          onChange={(e) => setChangeThreshold(e.target.value)}
        />
      </label>
      <table>
        <thead>
          <tr>
            <th>Валютная пара</th>
            <th>Минимальная цена</th>
            <th>Максимальная цена</th>
            <th>Процентное изменение</th>
          </tr>
        </thead>
        <tbody>
          {usdPairs.map((pair) => {
            const minPrice = minPrices[pair.symbol];
            const maxPrice = maxPrices[pair.symbol];
            const percentageChange = (
              (100 * (maxPrice - minPrice)) /
              minPrice
            ).toFixed(2);
            if (
              Number(percentageChange - 1) <= changeThreshold &&
              percentageChange !== "-Infinity" &&
              percentageChange >= changeThreshold - 0
            ) {
              return (
                <tr key={pair.symbol}>
                  <td style={{cursor:'pointer'}} onClick={() => setSymbol(pair.symbol)}>{pair.symbol}</td>
                  <td>{minPrice}</td>
                  <td>{maxPrice}</td>
                  <td>{percentageChange}%</td>
                </tr>
              );
            } else {
              return null;
            }
          })}
        </tbody>
      </table>
      <CandlestickChart symbol={symbol}></CandlestickChart>
    </div>
  );
}
export default BinanceData;
