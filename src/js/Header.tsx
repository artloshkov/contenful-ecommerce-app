import React  from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import useCartContext from "./contexts/CartContext";

const Header = () => {
  const cartContext = useCartContext();

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand as={ Link } to="/">Contentful / Apollo App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={ Link } to="/">Home</Nav.Link>
            <Nav.Link as={ Link } to="/categories">Categories</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={ Link } to="/cart" className="cart-icon-wrapper">
              <span>{ cartContext.productsTotalCount }</span>
              <FontAwesomeIcon icon={ faShoppingCart } />
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default React.memo(Header);
