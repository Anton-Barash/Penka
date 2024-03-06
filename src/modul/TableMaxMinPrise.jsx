
import PropTypes from 'prop-types'
import {
    MDBTableHead,
    MDBTableBody,

} from "mdb-react-ui-kit"
import { useTranslation } from "react-i18next";

function TableMaxMinPrise({ waitSpinner, usdPairs, maxPrices, minPrices, changeThreshold, setSymbol, setChangeThreshold, signs, change }) {

    const { t } = useTranslation();
    const minus2 = change ? 1 : -1;
    const tab = usdPairs.map((pair) => {
        const minPrice = minPrices[pair.symbol];
        const maxPrice = maxPrices[pair.symbol];
        const sign = signs[pair.symbol];
        const minus = sign ? 1 : -1;

        const percentageChange = minus * (
            (100 * (maxPrice - minPrice)) /
            minPrice
        )
        // console.log(percentageChange)
        if (
            (percentageChange - 1) <= changeThreshold &&
            percentageChange >= changeThreshold - 0
        ) {
            return (
                <tr key={pair.symbol}>
                    <td
                        style={{ cursor: "pointer" }}
                        onClick={() => setSymbol(pair.symbol)}
                    >
                        {pair.symbol}
                    </td>
                    <td>{minPrice ? minPrice : 0}</td>
                    <td>{maxPrice}</td>
                    <td className={sign ? 'text-success' : 'text-danger'}>{percentageChange.toFixed(2)}% </td>
                </tr>
            );
        } else {

            return null;
        }
    }).filter(Boolean)



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

                    {

                        !waitSpinner && (
                            tab.length ? tab :
                                (setChangeThreshold(
                                    (prevVal) => prevVal + minus2
                                ))
                        )

                    }

                </MDBTableBody>
            </table>

        </div>
    )
}

TableMaxMinPrise.propTypes = {
    usdPairs: PropTypes.array.isRequired, // Проверка, что usdPairs является массивом и обязателен для передачи
    maxPrices: PropTypes.object.isRequired, // Проверка, что maxPrices является объектом и обязателен для передачи
    minPrices: PropTypes.object.isRequired, // Проверка, что minPrices является объектом и обязателен для передачи
    signs: PropTypes.object.isRequired, // Проверка, что sign является объектом и обязателен для передачи
    changeThreshold: PropTypes.number.isRequired, // Проверка, что changeThreshold является числом и обязателен для передачи
    change: PropTypes.bool.isRequired,
    setChangeThreshold: PropTypes.func.isRequired,
    waitSpinner: PropTypes.bool.isRequired,
    setSymbol: PropTypes.func.isRequired,
};

export default TableMaxMinPrise


// setChangeThreshold((prevVal) => {
//     if (change && !waitSpinner) {
//         return prevVal + 1
//     }
//     else if (!waitSpinner) {
//         return prevVal - 1
//     }
// })