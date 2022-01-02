import React from "react";
import { IProduct } from "../Product";
import { Link } from "react-router-dom";
import GridWrapper from "./GridWrapper";
import SingleGridItemWrapper from "./SingleGridItemWrapper";

interface Props {
  categorySlug?: string,
  products: IProduct[],
}

const ProductsGrid = ({ categorySlug, products }: Props) =>
  <GridWrapper columns={4}>
      { products.map(product =>
        <SingleGridItemWrapper key={ product.slug }>
          <Link to={ "/" + (categorySlug ?? (product.categories ? product.categories[0].slug : "undefined")) + "/" + product.slug }><img src={ product.image ?? "" } alt={ product.name } /></Link>
          <Link to={ "/" + (categorySlug ?? (product.categories ? product.categories[0].slug : "undefined")) + "/" + product.slug }><p className="product-name">{ product.name }</p></Link>
          <p className="product-price">{ "$" + (product.price / 100).toFixed(2) }</p>
        </SingleGridItemWrapper>
      )}
  </GridWrapper>
;

export default ProductsGrid;
