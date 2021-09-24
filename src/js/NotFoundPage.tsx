import React, { Fragment } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "./Header";
import PageHeading from "./UI/PageHeading";

const NotFoundPage = () =>
  <Fragment>
    <Header />

    <Container fluid>
      <PageHeading>Page Not Found!</PageHeading>
      <p>Go to the <Link to="/">home</Link> page.</p>
    </Container>
  </Fragment>
;

export default React.memo(NotFoundPage);
