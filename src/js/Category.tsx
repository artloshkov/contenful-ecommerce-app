import React, { Fragment, useMemo } from "react";
import { Button, Container } from "react-bootstrap";
import { gql, useQuery } from "@apollo/client";
import { Link, Redirect, useParams } from "react-router-dom";
import Header from "./Header";
import { CategoryProductsCollection } from "./Product";
import ProductsGrid from "./UI/ProductsGrid";

interface UrlParams {
  categorySlug: string,
}

interface ICategory {
  id: number,
  name: string,
  slug: string,
  description: string,
  image: {
    title: string,
    url: string,
  },
  productsCollection?: CategoryProductsCollection,
}

export interface CategoryCollection {
  categoryCollection: {
    items: ICategory[],
  }
}

interface SingleCategoryVars {
  slug: string
}

const CATEGORY = gql`
  query CategoryEntry ($slug: String!) {
    categoryCollection (where: { slug: $slug }, limit: 1) {
      items {
        name,
        slug,
        description,
        image {
          title,
          url
        },
        productsCollection {
          items {
            name,
            slug,
            description,
            image {
              title,
              url
            },
            price,
            stock
          }
        }
      }
    }
  }
`;

const Category = () => {
  const { categorySlug } = useParams<UrlParams>();

  const { loading, error, data } = useQuery<CategoryCollection, SingleCategoryVars>(
    CATEGORY,
    { variables: { slug: categorySlug }, }
  );

  const category = useMemo(() => data?.categoryCollection.items[0], [ data ]);

  if (error) {
    return <Redirect to="/not-found" />;
  }

  return (
    <Fragment>
      <Header />

      <Container fluid>
        { loading && <p>Loading...</p> }
        { category &&
          <div className="category-page-wrapper">
            <div className="category-info-wrapper">
              <img src={ category.image.url } alt={ category.name } />
              <div className="category-info-inner">
                <h1>{ category.name }</h1>
                <p>{ category.description }</p>
              </div>
            </div>

            { category.productsCollection?.items &&
              <Fragment>
                <h2>Products</h2>
                <ProductsGrid products={ category.productsCollection.items } categorySlug={ categorySlug } />
              </Fragment>
            }

            <Button as={ Link } to="/" variant="secondary">Back</Button>
          </div>
        }
      </Container>
    </Fragment>

  );
};

export default Category;
