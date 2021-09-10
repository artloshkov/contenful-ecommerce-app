import React, { Fragment, useMemo, useState } from "react";
import { Button, Form, Container, Modal, CloseButton } from "react-bootstrap";
import { Link, Redirect, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Header from "./Header";
import { nullable } from "./utils/common";
import useCartContext from "./contexts/CartContext";

interface UrlParams {
  categorySlug: string,
  productSlug: string,
}

export interface IProduct {
  id: number,
  name: string,
  slug: string,
  description: string,
  image: {
    title: string,
    url: string,
  },
  price: number,
  stock: number,
}

export interface ProductCollection {
  productCollection: {
    items: IProduct[],
  }
}

export interface CategoryProductsCollection {
  items: IProduct[],
}

interface SingleProductVars {
  slug: string
}

const PRODUCT = gql`
  query ProductEntry ($slug: String!) {
    productCollection (where: { slug: $slug }, limit: 1) {
      items {
        id
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
`;

const Product = () => {
  const [ quantity, setQuantity ] = useState<nullable<number>>(1);
  const { categorySlug, productSlug } = useParams<UrlParams>();
  const [ isModalOpen, setIsModalOpen ] = useState<boolean>(false);
  const cartContext = useCartContext();

  const { loading, error, data } = useQuery<ProductCollection, SingleProductVars>(
    PRODUCT,
    { variables: { slug: productSlug }, }
  );

  const product = useMemo(() => data?.productCollection.items[0], [ data ]);

  if (error) {
    return <Redirect to="/not-found" />;
  }

  return (
    <Fragment>
      <Header />

      <Container fluid>
        { loading && <p>Loading...</p> }

        { product &&
          <div className="product-page-wrapper">
            <div className="product-info-wrapper">
              <img src={ product.image.url } alt={ product.name } />
              <div className="product-info-inner">
                <h1>{ product.name }</h1>
                <p className="product-price">{ "$" + (product.price / 100).toFixed(2) }</p>
                { product.stock > 0 ? <p className="product-in-stock">In Stock</p> : <p className="product-out-of-stock">Out Of Stock</p> }
                <p>{ product.description }</p>

                <hr />
                <div className="add-to-cart-row">
                  <p className="quantity-label">Quantity</p>
                  <Form.Control type="number" value={ quantity ?? "" } min={1} max={99} onChange={ (event) => parseInt(event.target.value) > 0 ? setQuantity(parseInt(event.target.value)) : setQuantity(null) } />

                  <span className="price-total">{ "$" + ((quantity ?? 0) * product.price / 100).toFixed(2) }</span>

                  <Button
                    variant="success"
                    onClick={ () => {
                      cartContext.addProduct(product.id, quantity ?? 0);
                      setIsModalOpen(true);
                    }}
                  >Add To Cart</Button>
                </div>
              </div>
            </div>

            <Button as={ Link } to={ "/" + categorySlug } variant="secondary">Back</Button>
          </div>
        }
      </Container>

      { isModalOpen && product &&
        <Modal
          show={ isModalOpen }
          onHide={ () => setIsModalOpen(false)}
          size="lg"
          centered
        >
          <Modal.Header>
            <Modal.Title>You've added { quantity } product{ quantity && quantity > 1 ? "s" : "" } to cart!</Modal.Title>
            <CloseButton className="btn modal-close-btn" onClick={ () => setIsModalOpen(false) } />
          </Modal.Header>
          <Modal.Body>
            <div className="modal-product-wrapper">
              <img src={ product.image.url } alt={ product.name } />

              <div className="product-info">
                <p className="product-name">{ product.name }</p>
                <p className="product-price">{ "$" + (product.price / 100).toFixed(2) }</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={ () => setIsModalOpen(false) }>Keep Shopping</Button>
            <Button variant="primary" as={ Link } to="/cart">Go To Cart</Button>
          </Modal.Footer>
        </Modal>
      }
    </Fragment>
  );
};

export default Product;
