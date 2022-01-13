import React, { Fragment, useCallback, useMemo, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Form, Modal, Row } from "react-bootstrap";
import useCartContext from "./contexts/CartContext";
import Header from "./Header";
import { nullable } from "./utils/common";
import PageHeading from "./UI/PageHeading";
import Spinner from "./UI/Spinner";
import styled from "styled-components";
import CartTotalWrapper from "./UI/CartTotalWraper";

interface CreateOrderResponse {
  createOrder: {
    id: string,
  }
}

interface CreateOrderVars {
  orderData: {
    name: string,
    email: string,
    phone: nullable<string>,
    address: string,
    total: number,
    // eslint-disable-next-line camelcase
    products: { product_id: number, quantity: number }[],
  }
}

const CREATE_ORDER = gql`
  mutation($orderData: OrderInput) {
    createOrder(orderData: $orderData) {
      id
    }
  }
`;

const ModalWrapper = styled.div`
  display: flex;
  align-items: center;

  svg {
    font-size: 2rem;
    margin-right: 1rem;
  }

  p {
    font-weight: 500;
    font-size: 1.25rem;
    line-height: 1.25;
  }
`;

const Checkout = () => {
  const cartContext = useCartContext();
  const [ name, setName ] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");
  const [ phone, setPhone ] = useState<string>("");
  const [ address, setAddress ] = useState<string>("");
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);

  const orderData = useMemo(() => {
    return {
      name: name,
      email: email,
      phone: phone,
      address: address,
      total: cartContext.getCartTotal(),
      products: Object.keys(cartContext.productsInCart).map((id) => { return { product_id: parseInt(id), quantity: cartContext.productsInCart[parseInt(id)] }; }),
    };
  }, [ name, email, phone, address, cartContext ]);

  const [ createOrder, { data, loading, error } ] = useMutation<CreateOrderResponse, CreateOrderVars>(CREATE_ORDER,
    { variables: { orderData: orderData } }
  );

  const isFormValid = useMemo(() => !!name && !!email && !!phone && !!address, [ name, email, phone, address ]);

  const _submitForm = useCallback(() => {
    setIsModalOpen(true);
    createOrder()
      .then(result => {
        if (result.data?.createOrder.id) {
          cartContext.clearCart();
        }
      })
    ;
  }, [ cartContext, createOrder ]);

  return (
    <Fragment>
      <Header />

      <Container fluid>
        <PageHeading>Checkout</PageHeading>

        <Row>
          <Col md={9}>
            <Card>
              <Form>
                <Card.Body>
                  <h2>Customer Information</h2>

                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" placeholder="First Name" name="name" value={ name } onChange={ (event) => setName(event.target.value) } />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Email" name="email" value={ email } onChange={ (event) => setEmail(event.target.value) } />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control type="text" placeholder="Phone Number" name="phone" value={ phone } onChange={ (event) => setPhone(event.target.value) } />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Address" name="address" value={ address } onChange={ (event) => setAddress(event.target.value) } />
                  </Form.Group>
                </Card.Body>

                <hr style={{ margin: 0 }} />

                <Card.Body style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button as={ Link } to="/cart" variant="secondary">Back to Cart</Button>
                  <Button onClick={ _submitForm } variant="primary" disabled={ !isFormValid }>Place Order</Button>
                </Card.Body>

              </Form>
            </Card>
          </Col>
          <Col md={3}>
            <CartTotalWrapper>
              <Card.Body>
                <Card.Title style={{ marginBottom: "1rem" }}>Order Summary</Card.Title>
                <Card.Text>Subtotal: { "$" + (cartContext.getCartTotal() / 100).toFixed(2) }</Card.Text>
                <Card.Text>Shipping: $0.00</Card.Text>
                <hr />
                <Card.Text className="cart-total-total">Total: { "$" + (cartContext.getCartTotal() / 100).toFixed(2) }</Card.Text>
              </Card.Body>
            </CartTotalWrapper>
          </Col>
        </Row>
      </Container>

      { isModalOpen &&
        <Modal
          show={ isModalOpen }
          onHide={ () => setIsModalOpen(false) }
          centered
        >
          <Modal.Body>
            <ModalWrapper>
              { loading &&
                <Fragment>
                  <Spinner />
                  <p style={{ margin: 0 }}>Your order is being placed...</p>
                </Fragment>
              }

              { error &&
                <div>
                  <p>There was an error placing your order. Please try again!</p>
                  <Button onClick={ () => setIsModalOpen(false) } variant="danger">Cancel</Button>
                </div>
              }

              { data?.createOrder.id &&
                <div>
                  <p>Thank you for placing your order!</p>
                  <Button as={ Link } to="/">Back to Shopping</Button>
                </div>
              }
            </ModalWrapper>
          </Modal.Body>
        </Modal>
      }
    </Fragment>
  );
};

export default Checkout;
