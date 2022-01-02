import React, { Fragment, useCallback, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import Header from "./Header";
import useCartContext from "./contexts/CartContext";
import { nullable } from "./utils/common";
import PageHeading from "./UI/PageHeading";
import CartTotalWrapper from "./UI/CartTotalWraper";
import styled from "styled-components";

const CartProductsWrapper = styled(Card)`
  hr {
    margin: 0;
  }

  .cart-single-product-wrapper {
    padding: 1rem;
    display: flex;

    &:not(:last-of-type) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }

    img {
      width: 300px;
      max-width: 100%;
    }

    .product-info-wrapper {
      margin-left: 1rem;
      display: flex;
      justify-content: space-between;
      flex: 1;

      .product-info-left {
        .product-title {
          font-size: 1rem;
          line-height: 1.25;
          font-weight: 600;
          color: ${ props => props.theme.greyColor };

          &:hover, &:focus {
            color: ${ props => props.theme.greyDarkColor };
          }
        }

        .product-price {
          font-size: 1.25rem;
          line-height: 1.25;
          font-weight: 600;
        }
      }

      .product-info-right {
        input {
          margin-bottom: 1rem;
        }

        .price-total {
          font-size: 1.25rem;
          line-height: 1.25;
          font-weight: 600;
        }
      }
    }
  }
`;

const Cart = () => {
  const cartContext = useCartContext();
  const [ redirect, setRedirect ] = useState<nullable<string>>(null);

  const _goToCheckoutPage = useCallback(() => setRedirect("/checkout"), []);

  if (redirect) {
    return <Navigate to={ redirect } />;
  }

  return (
    <Fragment>
      <Header />

      <Container fluid>
        <PageHeading>Shopping Cart</PageHeading>

        { Object.keys(cartContext.productsInCart).length > 0 && !cartContext.productsInfo.length && <p>Loading...</p> }

        <Row>
          <Col md={9}>
            <CartProductsWrapper>
              <Card.Body>
                <Card.Title style={{ margin: "0" }}>{ "Cart (" + cartContext.productsTotalCount + " items)" }</Card.Title>
              </Card.Body>
              <hr />
              { cartContext.productsInCart && cartContext.productsInfo &&
                <Card.Body style={{ padding: "0" }}>
                  { cartContext.productsInfo.map(product => {
                    const productId = parseInt(product.id);

                    return (
                      <div className="cart-single-product-wrapper" key={ product.id }>
                        <Link to={ "/undefined/" + product.slug }>
                          <img src={ product.image ?? "" } alt={ product.name } />
                        </Link>

                        <div className="product-info-wrapper">
                          <div className="product-info-left">
                            <Link to={ "/undefined/" + product.slug }>
                              <p className="product-title">{ product.name }</p>
                            </Link>
                            <p className="product-price">${ (product.price / 100).toFixed(2) }</p>
                            <Button variant="danger" onClick={ () => cartContext.removeProduct(productId, cartContext.productsInCart[productId]) }>Remove Item</Button>
                          </div>

                          <div className="product-info-right">
                            <Form.Control type="number" value={ cartContext.productsInCart[productId] ?? "" } min={1} max={99} onChange={ (event) => parseInt(event.target.value) > 0 ? cartContext.setProductQuantity(productId, parseInt(event.target.value)) : cartContext.setProductQuantity(productId, null) } />
                            <p>Total: <br /><span className="price-total">{ "$" + ((cartContext.productsInCart[productId] ?? 0) * product.price / 100).toFixed(2) }</span></p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Card.Body>
              }

            </CartProductsWrapper>
          </Col>
          <Col md={3}>
            <CartTotalWrapper>
              <Card.Body>
                <Card.Title style={{ marginBottom: "1rem" }}>Order Summary</Card.Title>
                <Card.Text>Subtotal: { "$" + (cartContext.getCartTotal() / 100).toFixed(2) }</Card.Text>
                <Card.Text>Shipping: $0.00</Card.Text>
                <hr />
                <Card.Text className="cart-total-total">Total: { "$" + (cartContext.getCartTotal() / 100).toFixed(2) }</Card.Text>
                <Button variant="primary" disabled={ Object.keys(cartContext.productsInCart).length === 0 } onClick={ _goToCheckoutPage }>Go To Checkout</Button>
              </Card.Body>
            </CartTotalWrapper>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Cart;
