import React, { Fragment } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "./Header";
import useCartContext from "./contexts/CartContext";

const Cart = () => {
  const cartContext = useCartContext();

  return (
    <Fragment>
      <Header />

      <Container fluid>
        <h1 style={{ textAlign: "center", margin: "1rem 0" }}>Shopping Cart</h1>
        { Object.keys(cartContext.productsInCart).length > 0 && !cartContext.productsInfo.length && <p>Loading...</p> }

        <Row>
          <Col md={9}>
            <Card className="cart-products-wrapper">
              <Card.Body>
                <Card.Title style={{ margin: "0" }}>{ "Cart (" + cartContext.productsTotalCount + " items)" }</Card.Title>
              </Card.Body>
              <hr />
              { cartContext.productsInCart && cartContext.productsInfo &&
                <Card.Body style={{ padding: "0" }}>
                  { cartContext.productsInfo.map(product =>
                    <div className="cart-single-product-wrapper" key={ product.id }>
                      <Link to={ "/undefined/" + product.slug }>
                        <img src={ product.image.url } alt={ product.image.title } />
                      </Link>

                      <div className="product-info-wrapper">
                        <div className="product-info-left">
                          <Link to={ "/undefined/" + product.slug }>
                            <p className="product-title">{ product.name }</p>
                          </Link>
                          <p className="product-price">${ (product.price / 100).toFixed(2) }</p>
                          <Button variant="danger" onClick={ () => cartContext.removeProduct(product.id, cartContext.productsInCart[ product.id ]) }>Remove Item</Button>
                        </div>

                        <div className="product-info-right">
                          <Form.Control type="number" value={ cartContext.productsInCart[ product.id ] ?? "" } min={1} max={99} onChange={ (event) => parseInt(event.target.value) > 0 ? cartContext.setProductQuantity(product.id, parseInt(event.target.value)) : cartContext.setProductQuantity(product.id, null) } />
                          <p>Total: <br /><span className="price-total">{ "$" + ((cartContext.productsInCart[ product.id ] ?? 0) * product.price / 100).toFixed(2) }</span></p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card.Body>
              }

            </Card>
          </Col>
          <Col md={3}>
            <Card className="cart-total-wrapper">
              <Card.Body>
                <Card.Title style={{ marginBottom: "1rem" }}>Order Summary</Card.Title>
                <Card.Text>Subtotal: { (cartContext.getCartTotal() / 100).toFixed(2) }</Card.Text>
                <Card.Text>Shipping: $0.00</Card.Text>
                <hr />
                <Card.Text className="cart-total-total">Total: { (cartContext.getCartTotal() / 100).toFixed(2) }</Card.Text>
                <Button variant="primary" as={ Link } to="/checkout">Go To Checkout</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Cart;
