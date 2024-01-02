import React, { useState, useEffect } from "react";
import axios from "axios";
import CandlestickChart from "./CandlestickChart";
import { useTranslation, Trans } from "react-i18next";
import debounce from "debounce";
import {
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBInput,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";

function BinanceData() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    setLng(lng);
    i18n.changeLanguage(lng);
  };
  const [lng, setLng] = React.useState("En");

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

  const fetchDataPairList = () => {
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
  };
  useEffect(() => {
    fetchDataPairList();
  }, [usdPairs]);

  useEffect(() => {
    const debouncedFetchData = debounce(() => {
      fetchDataPairList();
    }, 800);
    debouncedFetchData();
    return () => {
      debouncedFetchData.clear();
    };
  }, [weeks]);

  return (
    <div
      style={{
        textAlign: "right",
        padding: "5px",
        width: "100%",
        maxWidth: "1000px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h4>
          <img
            alt="Penka"
            style={{
              width: "27px",
              verticalAlign: "baseline",
              marginRight: "5px",
              opacity: 0.5,
            }}
            src="penka.jpg"
          ></img>
          Penka
        </h4>
        <MDBDropdown style={{ height: "min-content" }} group>
          <MDBDropdownToggle color="warning"> {lng}</MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem onClick={() => changeLanguage("en")} link>
              En
            </MDBDropdownItem>
            <MDBDropdownItem onClick={() => changeLanguage("ru")} link>
              Рус
            </MDBDropdownItem>
            <MDBDropdownItem onClick={() => changeLanguage("be")} link>
              Бел
            </MDBDropdownItem>
            <MDBDropdownItem onClick={() => changeLanguage("zh")} link>
              中文
            </MDBDropdownItem>
            <MDBDropdownItem onClick={() => changeLanguage("uk")} link>
              Укр
            </MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </div>

      <h2 style={{ marginTop: "5rem" }}>{t("tradingVolume", { weeks })}</h2>
      <div
        style={{
          display: "flex",
          margin: "1rem",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          flexDirection: "row-reverse",
        }}
      >
        <table
          className="text-white"
          borderless
          style={{
            marginRight: "auto",
            maxWidth: "fit-content",
            padding: "0.1rem",
          }}
        >
          <MDBTableHead>
            <tr style={{ fontSize: "large" }}>
              <th style={{ paddingLeft: "1rem" }}>{t("currencyPair")}</th>
              <th style={{ paddingLeft: "1rem" }}>{t("minPrice")}</th>
              <th style={{ paddingLeft: "1rem" }}>{t("maxPrice")}</th>
              <th style={{ paddingLeft: "1rem" }}> {t("percentageChange")}</th>
            </tr>
          </MDBTableHead>

          <MDBTableBody>
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
                  <tr className="text-white" key={pair.symbol}>
                    <td
                      style={{ cursor: "pointer" }}
                      onClick={() => setSymbol(pair.symbol)}
                    >
                      {pair.symbol}
                    </td>
                    <td>{minPrice ? minPrice : 0}</td>
                    <td>{maxPrice}</td>
                    <td>{percentageChange}%</td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </MDBTableBody>
        </table>
        <div
          style={{
            order: "-1",
            display: "flex",
            marginLeft: "1rem",
            flex: "1 1 255px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
          }}
        >
          <label style={{ width: "100%", maxWidth: "365px" }}>
            {t("selectWeeks")}{" "}
            <MDBInput
              contrast
              type="number"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
            />
          </label>

          <label style={{ width: "100%", maxWidth: "365px" }}>
            {t("thresholdPercentageChange")}{" "}
            <MDBInput
              contrast
              type="number"
              value={changeThreshold}
              onChange={(e) => setChangeThreshold(e.target.value)}
            />
          </label>
        </div>
      </div>
      <CandlestickChart symbol={symbol}></CandlestickChart>
    </div>
  );
}
export default BinanceData;
