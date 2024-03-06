import styled from '@emotion/styled'
import { MDBIcon } from 'mdb-react-ui-kit';
import PropTypes from 'prop-types';

const RButton = styled.button`
box-sizing: border-box;
padding-bottom: 4px
 font-size: x-large;
  width: 30px;
  height: 30px;
  border-radius: 50%;
 color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: solid;
  outline: none;
  &:hover {
    background-color: #0056b3;
  }
`;

const RoundButton = ({ onClick, text }) => {
    return (

        <RButton onClick={onClick}>
            <MDBIcon style={{ color: 'black' }} iconType='solid' icon={text}>
            </MDBIcon>

        </RButton>


    );
};

RoundButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired, // Меняем PropTypes.node на PropTypes.string
};

export default RoundButton;