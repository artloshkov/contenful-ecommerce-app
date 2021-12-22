import styled from "styled-components"

const SingleGridItemWrapper = styled.div`
  border: 1px solid #eee;
  padding: 1rem;

  a {
    color: ${ props => props.theme.greyColor };

    &:hover, &:focus {
      color: ${ props => props.theme.greyDarkColor };
    }
  }

  &:hover {
    background-color: #eee;
  }

  .product-name {
    padding: 1rem 0;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.25;
    color: ${ props => props.theme.greyColor };
    margin: 0;

    &:hover, &:focus {
      color: ${ props => props.theme.greyDarkColor };
    }
  }

  .product-price {
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1;
    padding: 0;
    margin: 0;
  }
`;

export default SingleGridItemWrapper;
