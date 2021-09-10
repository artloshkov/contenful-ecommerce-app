import React, { Fragment, useMemo } from "react";
import Header from "./Header";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { CategoryCollection } from "./Category";

const CATEGORIES = gql`
  query {
    categoryCollection (order: [id_ASC]) {
      items {
        id
        name,
        slug,
        description,
        image {
          title,
          url
        }
      }
    }
  }
`;

const Categories = () => {
  const { loading, data } = useQuery<CategoryCollection>(CATEGORIES);

  const categories = useMemo(() => data?.categoryCollection.items, [ data ]);

  return (
    <Fragment>
      <Header />

      <Container fluid>
        <h1 style={{ textAlign: "center", margin: "1rem 0" }}>Product Categories</h1>
        { loading && <p>Loading...</p> }

        { categories &&
          <div className="homepage-categories-wrapper">
            { categories?.map(category =>
              <div key={ category.id } className="category-single-wrapper">
                <Link to={ "/" + category.slug }>
                  <img src={ category.image.url } alt={ category.name } />
                  <h3>{ category.name }</h3>
                </Link>
              </div>
            )}
          </div>
        }
      </Container>
    </Fragment>
  );
};

export default Categories;
