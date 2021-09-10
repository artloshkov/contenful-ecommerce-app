import React, { Fragment } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "./Header";

const NotFoundPage = () =>
  <Fragment>
    <Header />

    <Container fluid>
      <h1>Page Not Found!</h1>
      <p>Go to the <Link to="/">home</Link> page.</p>
    </Container>
  </Fragment>
;

export default React.memo(NotFoundPage);
