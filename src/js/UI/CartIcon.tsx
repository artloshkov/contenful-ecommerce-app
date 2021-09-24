import React from "react";
import styled from "styled-components";
import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import useCartContext from "../contexts/CartContext";

const CartIconWrapper = styled(Nav.Link)`
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  span {
    font-weight: 600;
    margin-right: 0.5rem;
    background: ${ props => props.theme.greyDarkColor };
    color: #fff;
    font-size: 1rem;
    min-width: 32px;
    display: block;
    text-align: center;
    padding: 0.25rem;
  }

  svg {
    font-size: 1.5rem;
    color: ${ props => props.theme.greyDarkColor };
  }
`;

const CartIcon = () => {
  const cartContext = useCartContext();

  return (
    <CartIconWrapper as={ Link } to="/cart">
      <span>{ cartContext.productsTotalCount }</span>
      <FontAwesomeIcon icon={ faShoppingCart } />
    </CartIconWrapper>
  );
};

export default CartIcon;
