/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import PropTypes from 'prop-types';

const RButton = styled.button`
box-sizing: border-box;
padding-bottom: 4px
 font-size: x-large;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #282c34;
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
            {text}
        </RButton>
    );
};

RoundButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired, // Меняем PropTypes.node на PropTypes.string
};

export default RoundButton;