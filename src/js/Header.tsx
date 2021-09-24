import React  from "react";
import { Container, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import CartIcon from "./UI/CartIcon";

const Header = () =>
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
          <CartIcon />
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
;

export default React.memo(Header);
