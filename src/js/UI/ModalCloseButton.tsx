import React from "react";
import { CloseButton } from "react-bootstrap";
import styled from "styled-components";

interface Props {
  onClick: React.MouseEventHandler<HTMLButtonElement>,
}

const StyledCloseButton = styled(CloseButton)`
  line-height: 1;
  box-sizing: border-box;

  span {
    font-size: 2rem;
  }
`;

const ModalCloseButton = ({ onClick }: Props) => <StyledCloseButton className="btn" onClick={ onClick } />;

export default ModalCloseButton;
