import React, { Fragment, useMemo } from "react";
import { Button, Container } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { Link, Navigate, useParams } from "react-router-dom";
import Header from "./Header";
import { IProduct } from "./Product";
import ProductsGrid from "./UI/ProductsGrid";
import styled from "styled-components";

// interface UrlParams {
//   categorySlug: string,
// }

export interface ICategory {
  id: string,
  name: string,
  slug: string,
  description: string,
  image: string,
  products: IProduct[],
}

interface SingleCategoryVars {
  slug: string
}

const CATEGORY = gql`
  query getSingleCategoryBySlug ($slug: String!) {
    getSingleCategoryBySlug (slug: $slug) {
      name,
      slug,
      description,
      image,
      products {
        name,
        slug,
        description,
        image,
        price,
        stock
      }
    }
  }
`;

const CategoryPageWrapper = styled.div`
  margin: 1rem 0;

  .category-info-wrapper {
    display: flex;
    justify-content: space-between;

    img {
      width: 400px;
      max-width: 100%;
      margin: 0 1rem 1rem 0;
    }
  }
`;

const Category = () => {
  const { categorySlug } = useParams();

  const { loading, error, data } = useQuery<{ getSingleCategoryBySlug: ICategory }, SingleCategoryVars>(
    CATEGORY,
    { variables: { slug: categorySlug ?? "" } },
  );

  const category = useMemo(() => data?.getSingleCategoryBySlug, [data]);

  if (error) {
    return <Navigate to="/not-found" />;
  }

  return (
    <Fragment>
      <Header />

      <Container fluid>
        { loading && <p>Loading...</p> }

        { !loading && !category && <Navigate to="/not-found" /> }

        { !loading && category &&
          <CategoryPageWrapper>
            <div className="category-info-wrapper">
              <img src={ category.image ?? "" } alt={ category.name } />
              <div className="category-info-inner">
                <h1>{ category.name }</h1>
                <p>{ category.description }</p>
              </div>
            </div>

            { category.products &&
              <Fragment>
                <h2>Products</h2>
                <ProductsGrid products={ category.products } categorySlug={ categorySlug } />
              </Fragment>
            }

            <Button as={ Link } to="/" variant="secondary">Back</Button>
          </CategoryPageWrapper>
        }
      </Container>
    </Fragment>

  );
};

export default Category;
