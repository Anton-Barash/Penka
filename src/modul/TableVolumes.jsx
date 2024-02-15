import PropTypes from 'prop-types'
import {
    MDBTableHead,
    MDBTableBody,

} from "mdb-react-ui-kit"
import { useTranslation } from "react-i18next";


function TableVolimes({ volume, setSymbol, list }) {

    const sliceVolume = volume.slice(list * 10 - 10, list * 10 - 1);
    const { t } = useTranslation();

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
                    <th >{t("minValue")}</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {
                    sliceVolume.map((obj) => {
                        const [currencyPair, value] = Object.entries(obj)[0];
                        return (
                            <tr className="text-white" key={currencyPair}>
                                <td style={{ cursor: "pointer" }} onClick={() => setSymbol(currencyPair)}>
                                    {currencyPair}
                                </td>
                                <td style={{ paddingLeft: "1rem" }}>{value}</td>
                            </tr>
                        );
                    })
                }
            </MDBTableBody>
        </table>


    )
}

TableVolimes.propTypes = {
    volume: PropTypes.array,
    setSymbol: PropTypes.func,
    list: PropTypes.number
};

export default TableVolimes;