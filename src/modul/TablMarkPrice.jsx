import PropTypes from 'prop-types'
import {
    MDBTableHead,
    MDBTableBody,

} from "mdb-react-ui-kit"
import { useTranslation } from "react-i18next";


function TablMarkPrice({ markPrice, setSymbol, list }) {


    const { t } = useTranslation();
    const sortMarkPrice = markPrice.sort(
        (a, b) => a.percent - b.percent
    ).filter(
        (obj) => {
            return obj.minPrices != Number.MAX_VALUE
        }
    )

    const slicemarkPrice = sortMarkPrice.slice(list * 10 - 10, list * 10 - 1);
    return (

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
                    <th >{t("currencyPair")}</th>
                    <th >{t('minPrice')}</th>
                    <th >{'markPrice:'}</th>
                    <th >{"%"}</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {
                    slicemarkPrice.map((obj) => {
                        // const [currencyPair, value] = Object.entries(obj)[0];
                        return (
                            <tr className="text-white" key={obj.symbol + '%'}>
                                <td style={{ cursor: "pointer" }} onClick={() => setSymbol(obj.symbol)}>
                                    {obj.symbol}
                                </td>
                                <td style={{ paddingLeft: "1rem" }}>{obj.minPrices}</td>
                                <td style={{ paddingLeft: "1rem" }}>{obj.markPrice}</td>
                                <td style={{ paddingLeft: "1rem" }}>{obj.percent}</td>
                            </tr>
                        );
                    })
                }
            </MDBTableBody>
        </table>


    )
}

TablMarkPrice.propTypes = {
    markPrice: PropTypes.array,
    setSymbol: PropTypes.func,
    list: PropTypes.number
};

export default TablMarkPrice;