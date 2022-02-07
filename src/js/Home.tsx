import React, { Fragment, useMemo } from "react";
import {
  gql,
  useQuery,
} from "@apollo/client";
import { Container } from "react-bootstrap";
import Header from "./Header";
import { ProductCollection } from "./Product";
import ProductsGrid from "./UI/ProductsGrid";
import PageHeading from "./UI/PageHeading";

const RECENT_PRODUCTS = gql`
  query {
    getAllProducts(limit: 10) {
      id,
      categories {
        id,
        slug
      }
      name,
      slug,
      image,
      price,
      stock
    }
  }
`;

const Home = () => {
  const { loading, data } = useQuery<ProductCollection>(RECENT_PRODUCTS);

  const products = useMemo(() => data?.getAllProducts, [data]);

  return (
    <Fragment>
      <Header />

      <Container fluid>
        <PageHeading>Latest Products</PageHeading>

        { loading && <p>Loading...</p> }

        { products && <ProductsGrid products={ products } /> }
      </Container>
    </Fragment>
  );
};

export default Home;
