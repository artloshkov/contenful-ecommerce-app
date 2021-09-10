import React, { Fragment, useMemo } from "react";
import {
  gql,
  useQuery,
} from "@apollo/client";
import { Container } from "react-bootstrap";
import Header from "./Header";
import { ProductCollection } from "./Product";
import ProductsGrid from "./UI/ProductsGrid";

const RECENT_PRODUCTS = gql`
  query {
    productCollection(limit: 10, where: { stock_gt: 0 }) {
      items {
        id,
        name,
        slug,
        image {
          title,
          url
        },
        price,
        stock
      }
    }
  }
`;

const Home = () => {
  const { loading, data } = useQuery<ProductCollection>(RECENT_PRODUCTS);

  const products = useMemo(() => data?.productCollection.items, [ data ]);

  return (
    <Fragment>
      <Header />

      <Container fluid>
        <h1 style={{ textAlign: "center", margin: "1rem 0" }}>Latest Products</h1>

        { loading && <p>Loading...</p> }

        { products && <ProductsGrid products={ products } /> }
      </Container>
    </Fragment>
  );
};

export default Home;
