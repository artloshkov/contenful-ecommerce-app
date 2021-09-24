import React, { Fragment, useMemo } from "react";
import Header from "./Header";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { ICategory } from "./Category";
import PageHeading from "./UI/PageHeading";
import GridWrapper from "./UI/GridWrapper";
import SingleGridItemWrapper from "./UI/SingleGridItemWrapper";

const CATEGORIES = gql`
  query {
    getAllCategories (order: "id_ASC") {
      id
      name,
      slug,
      image
    }
  }
`;

const Categories = () => {
  const { loading, data } = useQuery<{ getAllCategories: ICategory[] }>(CATEGORIES);

  const categories = useMemo(() => data?.getAllCategories, [ data ]);

  return (
    <Fragment>
      <Header />

      <Container fluid>
        <PageHeading>Product Categories</PageHeading>

        { loading && <p>Loading...</p> }

        { categories &&
          <GridWrapper columns={4}>
            { categories?.map(category =>
              <SingleGridItemWrapper key={ category.id }>
                <Link to={ "/" + category.slug }>
                  <img src={ category.image ?? "" } alt={ category.name } />
                  <h3>{ category.name }</h3>
                </Link>
              </SingleGridItemWrapper>
            )}
          </GridWrapper>
        }
      </Container>
    </Fragment>
  );
};

export default Categories;
