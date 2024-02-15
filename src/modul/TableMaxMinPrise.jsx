
import PropTypes from 'prop-types'
import {
    MDBTableHead,
    MDBTableBody,

} from "mdb-react-ui-kit"
import { useTranslation } from "react-i18next";


function TableMaxMinPrise({ usdPairs, maxPrices, minPrices, changeThreshold, setSymbol }) {

    const { t } = useTranslation();

    return (
        <div>

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

        </div>
    )
}

TableMaxMinPrise.propTypes = {
    usdPairs: PropTypes.array.isRequired, // Проверка, что usdPairs является массивом и обязателен для передачи
    maxPrices: PropTypes.object.isRequired, // Проверка, что maxPrices является объектом и обязателен для передачи
    minPrices: PropTypes.object.isRequired, // Проверка, что minPrices является объектом и обязателен для передачи
    changeThreshold: PropTypes.number.isRequired, // Проверка, что changeThreshold является числом и обязателен для передачи
};

export default TableMaxMinPrise
