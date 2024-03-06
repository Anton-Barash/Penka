import React, { useState, useEffect } from "react";
import axios from "axios";
import CandlestickChart from "./CandlestickChart";
import { useTranslation } from "react-i18next";
import debounce from "debounce";

import {
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBInput,
  MDBSpinner,

} from "mdb-react-ui-kit";
import DisqusComments from "./DisqusComments";
import BuyMeACoffeeButton from "./BuyMeACoffeeButton";
// import BinanceDataVolume from "./BinanceDataVolume";
import RoundButton from "./elements/RoundButton";
import styled from '@emotion/styled';
import TableMaxMinPrise from "./TableMaxMinPrise";
import TableVolimes from "./TableVolumes";

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Затемнение фона */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
   ${(props) => (props.wait ? '' : 'display: none;')} /* Добавляем условие для скрытия модального окна */
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;


function BinanceData() {
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => {
    setLng(lng);
    i18n.changeLanguage(lng);
  };
  const [lng, setLng] = React.useState("En");
  const [minPrices, setMinPrices] = useState({});
  const [maxPrices, setMaxPrices] = useState({});
  const [signs, setSigns] = useState({})
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
  const [volume, setVolume] = useState(['USD', '100000'])
  const [list, setList] = useState(0)
  const [change, setChange] = useState(false)

  const [waitSpinner, setWaitSpinner] = React.useState(true)

  const excludedPairs = [
    "TUSDUSDT",
    "USDCUSDT",
    "BUSDUSDT",
    "USDPUSDT",
    "FDUSDUSDT",
    "GBPUSDT",
    "EURUSDT",
  ];

  const fetchDataPairList = async () => {
    setWaitSpinner(true);
    try {
      const requests = usdPairs.map(async (pair) => {
        const response = await axios.get(
          `${baseUrl}${endPoint}?symbol=${pair.symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`
        );
        let lowestLow = Number.MAX_VALUE;
        let highestHigh = 0;
        let signs = false
        let vol = []
        for (const data of response.data) {

          const lowPrice = parseFloat(data[3]);
          const highPrice = parseFloat(data[2]);
          if (lowPrice < lowestLow) {
            lowestLow = lowPrice;
            signs = false // цена опустилась
          }
          if (highPrice > highestHigh) {
            highestHigh = highPrice;
            signs = true // цена цена поднялась
          }
          vol.push(data[7])
        }

        return { symbol: pair.symbol, lowestLow, highestHigh, vol, signs };
      });

      const results = await Promise.all(requests);
      // console.log('results', results)
      const signsObj = results.reduce((obj, item) => {
        obj[item.symbol] = item.signs;
        return obj;
      }, {});

      const minPricesObj = results.reduce((obj, item) => {
        obj[item.symbol] = item.lowestLow;
        return obj;
      }, {});

      const maxPricesObj = results.reduce((obj, item) => {
        obj[item.symbol] = item.highestHigh;
        return obj;
      }, {});

      let averageVolume = results.map(item => {
        const average = (item.vol.reduce((sum, elem) => sum + Number(elem), 0)) / item.vol.length;
        return { [item.symbol]: average };
      }).filter(item => !isNaN(Object.values(item)[0])).sort((a, b) => Object.values(a)[0] - Object.values(b)[0]);

      // сортировка и удаление nan
      setMinPrices(minPricesObj);
      setMaxPrices(maxPricesObj);
      setVolume(averageVolume)
      setSigns(signsObj)

      setWaitSpinner(false);

    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    } finally {
      setWaitSpinner(false);
    }
  };

  useEffect(() => {
    // Запрос для получения списка всех торговых пар с USDT
    axios
      .get(`${baseUrl}/api/v3/exchangeInfo`)
      .then((response) => {

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
    const debouncedFetchData = debounce(() => {
      fetchDataPairList()
    }, 800);
    debouncedFetchData();
    return () => {
      debouncedFetchData.clear();
    };
  }, [weeks, usdPairs]);

  return (
    <div
      style={{
        textAlign: "right",
        padding: "5px",
        width: "100%",
        maxWidth: "1000px",
      }}
    >
      <Modal wait={waitSpinner}>
        <ModalContent>
          <MDBSpinner color='success'>
            <span className='visually-hidden'>Loading...</span>
          </MDBSpinner>
        </ModalContent>
      </Modal>
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
      <label >
        {t("selectWeeks")}{" "}

        <div
          style={{ display: 'flex', alignItems: 'center' }}>
          <RoundButton onClick={() => { setWeeks((e) => { return Number(e) - 1 }) }} text="minus" ></RoundButton>

          <MDBInput
            contrast
            type="number"
            value={weeks}
            onChange={(e) => setWeeks(e.target.value)}
          />
          <RoundButton onClick={() => { setWeeks((e) => { return Number(e) + 1 }) }} text="plus" ></RoundButton>
        </div>
      </label>
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

        <TableMaxMinPrise waitSpinner={waitSpinner} change={change} usdPairs={usdPairs} minPrices={minPrices} maxPrices={maxPrices} changeThreshold={changeThreshold} setChangeThreshold={setChangeThreshold} signs={signs} setSymbol={setSymbol}>

        </TableMaxMinPrise>
        <div
          style={{
            order: "-1",
            display: "flex",
            marginLeft: "1rem",
            flex: "1 1 255px",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >

          <label style={{ width: "100%", maxWidth: "234px" }}>
            {t("thresholdPercentageChange")}
            <div style={{ display: 'flex', alignItems: 'center' }}>


              <RoundButton onClick={() => {
                setChangeThreshold((prevValue) => prevValue - 1);
                setChange(false);
              }} text="minus" />
              <MDBInput
                contrast
                type="number"
                value={changeThreshold}
                onChange={(e) => setChangeThreshold(e.target.value)}
              />
              <RoundButton onClick={() => {
                setChangeThreshold((prevValue) => prevValue + 1);
                setChange(false);
              }} text="plus" />
            </div>
          </label>
        </div>
      </div>
      <CandlestickChart symbol={symbol}></CandlestickChart>
      <BuyMeACoffeeButton></BuyMeACoffeeButton>
      <h1 style={{ margin: '1rem' }}>Lowest sales volumes in (USDT):</h1>
      <div style={{
        display: "flex",
        margin: "1rem",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        flexDirection: "row-reverse",
      }}>
        <label>
          Номер пары:
          <div style={{ display: 'flex', alignItems: 'center' }}>

            <RoundButton onClick={() => { setList((e) => { return Number(e) - 1 }) }} text="minus" ></RoundButton>
            <MDBInput
              contrast
              type="number"
              value={list}
              onChange={(e) => setList(e.target.value)}
            />
            <RoundButton onClick={() => { setList((e) => { return Number(e) + 1 }) }} text="plus" ></RoundButton>
          </div>
        </label>
        <TableVolimes volume={volume} setSymbol={setSymbol} list={list}></TableVolimes>
      </div>
      <DisqusComments></DisqusComments>
    </div>
  );
}
export default BinanceData;
