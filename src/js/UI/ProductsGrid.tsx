import React from "react";
import { IProduct } from "../Product";
import { Link } from "react-router-dom";

interface Props {
  categorySlug?: string,
  products: IProduct[],
}

const ProductsGrid = ({ categorySlug, products }: Props) =>
  <div className="products-grid-wrapper">
    <div className="products-grid-inner-wrapper">
      { products.map(product =>
        {
          if (product.stock > 0) {
            return (
              <div className="single-product-wrapper" key={ product.slug }>
                <Link to={ "/" + categorySlug + "/" + product.slug }><img src={ product.image.url } alt={ product.name } /></Link>
                <Link to={ "/" + categorySlug + "/" + product.slug }><p className="product-name">{ product.name }</p></Link>
                <p className="product-price">{ "$" + (product.price / 100).toFixed(2) }</p>
              </div>
            );
          }

          return null;
        }
      )}
    </div>
  </div>
;

export default ProductsGrid;
