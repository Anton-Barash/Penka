import { useEffect, useState } from 'react';
import axios from 'axios';
import CandlestickChart from './CandlestickChart';
import PropTypes from 'prop-types';

import {
    MDBTableHead,
    MDBTableBody,
    MDBInput
} from "mdb-react-ui-kit";



const BinanceDataVolume = ({ usdPairs }) => {
    BinanceDataVolume.propTypes = {
        usdPairs: PropTypes.array.isRequired,
    };

    const [maxVolumes, setMaxVolumes] = useState({});
    const [minVolumes, setMinVolumes] = useState({});


    const [weeks, setWeeks] = useState(4); // По умолчанию 4 недели
    const dayOfWeek = new Date().getDay();
    const [changeThreshold, setChangeThreshold] = useState(16);
    const baseUrl = "https://api.binance.com";
    const endPoint = "/api/v3/klines";
    const interval = "1w"; // интервал недели
    const currentTime = new Date().getTime(); // текущее время в миллисекундах
    const startTime = currentTime - weeks * 7 * 24 * 60 * 60 * 1000; // время начала (4 недели назад)
    const endTime = currentTime - (dayOfWeek * 24 * 60 * 60 * 1000);
    const [symbol, setSymbol] = useState("TUSDUSDT");
    const [sortVolumes, setSortVolumes] = useState(['ds'])

    const fetchDataPairList = async () => {
        // console.log('fetch');

        try {
            const requests = usdPairs.map((pair) => {
                return axios.get(`${baseUrl}${endPoint}?symbol=${pair.symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
            });

            const responses = await Promise.all(requests);

            responses.forEach((response, index) => {
                let maxVolume = 0;
                let minVolume = Number.MAX_VALUE;

                for (const data of response.data) {
                    const tradeVolume = parseFloat(data[5]);
                    if (tradeVolume > maxVolume) {
                        maxVolume = tradeVolume;
                    }
                    if (tradeVolume < minVolume) {
                        minVolume = tradeVolume;
                    }
                }

                setMaxVolumes((prev) => {
                    return { ...prev, [usdPairs[index].symbol]: maxVolume };
                });

                setMinVolumes((prev) => {
                    // console.log(...maxVolumes)
                    return { ...prev, [usdPairs[index].symbol]: minVolume };
                });
            });

            // Дополнительная обработка после завершения всех запросов
            // console.log(maxVolumes[0])
            const sortedVolumes = Object.fromEntries(
                Object.entries(maxVolumes).sort(([, a], [, b]) => a - b)
            );
            setSortVolumes(sortedVolumes);
            // console.log(sortVolumes)

        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchDataPairList();
    }, []); // Вызовите функцию получения данных при монтировании компонента

    return (
        <div>
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
                    style={{
                        marginRight: "auto",
                        maxWidth: "fit-content",
                        padding: "0.1rem",
                    }}
                >
                    <MDBTableHead>
                        <tr style={{ fontSize: "large" }}>
                            <th style={{ paddingLeft: "1rem" }}>{'currencyPair'}</th>
                            <th style={{ paddingLeft: "1rem" }}>{'minVolume'}</th>
                            <th style={{ paddingLeft: "1rem" }}>{'maxVolume'}</th>
                            <th style={{ paddingLeft: "1rem" }}> {'percentageChange'}</th>
                        </tr>
                    </MDBTableHead>

                    <MDBTableBody>
                        {usdPairs.map((pair) => {
                            const minVolume = minVolumes[pair.symbol]; // Объем торгов вместо минимальной цены
                            const maxVolume = maxVolumes[pair.symbol]; // Объем торгов вместо максимальной цены
                            const percentageChange = (
                                (100 * (maxVolume - minVolume)) / minVolume
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
                                        <td>{minVolume ? minVolume : 0}</td>
                                        <td>{maxVolume}</td>
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
                        alignItems: "flex-end",
                    }}
                >
                    <label style={{ width: "100%", maxWidth: "365px" }}>
                        {"selectWeeks"}{" "}
                        <MDBInput
                            contrast
                            type="number"
                            value={weeks}
                            onChange={(e) => setWeeks(e.target.value)}
                        />
                    </label>

                    <label style={{ width: "100%", maxWidth: "365px" }}>
                        {'Percent Change'}{" "}
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
            <table className="text-white" style={{ marginRight: "auto", maxWidth: "fit-content", padding: "0.1rem" }}>
                <MDBTableHead>
                    <tr style={{ fontSize: "large" }}>
                        <th style={{ paddingLeft: "1rem" }}>currencyPair</th>
                        <th style={{ paddingLeft: "1rem" }}>minVolume</th>

                    </tr>
                </MDBTableHead>

                <MDBTableBody>
                    {usdPairs.map((pair) => {
                        const sortVolum = sortVolumes[pair.symbol]; // Объем торгов вместо минимальной цены

                        if (sortVolum) {
                            return (
                                <tr className="text-white" key={pair.symbol}>
                                    <td style={{ cursor: "pointer" }} onClick={() => setSymbol(pair.symbol)}>
                                        {pair.symbol}
                                    </td>
                                    <td>{sortVolum}</td>
                                    {/* Add maxVolume and percentageChange here */}
                                </tr>
                            );
                        } else {
                            return null;
                        }
                    })}
                </MDBTableBody>
            </table>


        </div>
    )
};

export default BinanceDataVolume;