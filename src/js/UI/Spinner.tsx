import React from "react";
import styled, { keyframes } from "styled-components";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  animation: ${spin} infinite 1.5s linear;
`;

const Spinner = () => <StyledFontAwesomeIcon icon={ faSpinner } />;

export default Spinner;
