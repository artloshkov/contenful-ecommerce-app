import React from "react";
import styled from "styled-components";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const CartIconWrapper = styled(Nav.Link)`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;

  span {
    font-weight: 600;
    margin-right: 0.5rem;
    background: ${ props => props.theme.greyDarkColor };
    color: #fff;
    font-size: 1rem;
    min-width: 32px;
    display: flex;
    text-align: center;
    height: 32px;
    justify-content: center;
    align-items: center;
  }

  svg {
    font-size: 1.5rem;
    color: ${ props => props.theme.greyDarkColor };
  }
`;

const CartIcon = ({ productsNumber }: { productsNumber: number }) =>
  <CartIconWrapper as={ Link } to="/cart">
    <span>{ productsNumber }</span>
    <FontAwesomeIcon icon={ faShoppingCart } />
  </CartIconWrapper>
;

export default CartIcon;
