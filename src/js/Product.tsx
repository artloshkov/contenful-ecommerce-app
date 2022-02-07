import React, { Fragment, useMemo, useState } from "react";
import { Button, Form, Container, Modal } from "react-bootstrap";
import { Link, Navigate, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import Header from "./Header";
import { nullable } from "./utils/common";
import useCartContext from "./contexts/CartContext";
import { ICategory } from "./Category";
import ModalCloseButton from "./UI/ModalCloseButton";
import styled from "styled-components";

export interface IProduct {
  id: string,
  categories?: ICategory[],
  name: string,
  slug: string,
  description: nullable<string>,
  image: nullable<string>,
  price: number,
  stock: number,
}

export interface ProductCollection {
  getAllProducts: IProduct[]
}

interface SingleProductVars {
  slug: string
}

const PRODUCT = gql`
  query getSingleProductBySlug ($slug: String!) {
    getSingleProductBySlug (slug: $slug) {
      id
      name,
      slug,
      description,
      image,
      price,
      stock
    }
  }
`;

const ProductPageWrapper = styled.div`
  margin: 1rem 0;

  .product-info-wrapper {
    display: flex;
    justify-content: space-between;

    img {
      width: 400px;
      max-width: 100%;
      margin: 0 1rem 1rem 0;
    }

    .product-info-inner {
      .product-price {
        font-weight: 600;
        font-size: 1.25rem;
        line-height: 1;
      }

      .product-in-stock {
        font-weight: 600;
        line-height: 1;
        color: #198754;
      }

      .product-out-of-stock {
        font-weight: 600;
        line-height: 1;
        color: #dc3545;
      }

      .add-to-cart-row {
        display: flex;
        align-items: center;

        .quantity-label {
          margin: 0 1rem 0 0;
        }

        input[type="number"] {
          max-width: 70px;
        }

        .price-total {
          margin: 0 1rem;
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1;
        }

        button {}
      }
    }
  }
`;

const ModalWrapper = styled.div`
  display: flex;

  img {
    width: 300px;
    margin-right: 1rem;
  }

  .product-info {
    p {
      line-height: 1.25;
      font-weight: 600;
    }

    .product-name {
      font-size: 1.25rem;
    }

    .product-price {

    }
  }
`;

const Product = () => {
  const [quantity, setQuantity] = useState<nullable<number>>(1);
  const { categorySlug, productSlug } = useParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const cartContext = useCartContext();

  const { loading, error, data } = useQuery<{ getSingleProductBySlug: IProduct }, SingleProductVars>(
    PRODUCT,
    { variables: { slug: productSlug ?? "" }, }
  );

  const product = useMemo(() => data?.getSingleProductBySlug, [data]);

  if (error) {
    return <Navigate to="/not-found" />;
  }

  return (
    <Fragment>
      <Header />

      <Container fluid>
        { loading && <p>Loading...</p> }

        { !loading && !product && <Navigate to="/not-found" /> }

        { !loading && product &&
          <ProductPageWrapper>
            <div className="product-info-wrapper">
              <img src={ product.image ?? "" } alt={ product.name } />
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
                      cartContext.addProduct(parseInt(product.id), quantity ?? 0);
                      setIsModalOpen(true);
                    }}
                  >Add To Cart</Button>
                </div>
              </div>
            </div>

            <Button as={ Link } to={ "/" + categorySlug } variant="secondary">Back</Button>
          </ProductPageWrapper>
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
            <Modal.Title>You&apos;ve added { quantity } product{ quantity && quantity > 1 ? "s" : "" } to cart!</Modal.Title>
            <ModalCloseButton onClick={ () => setIsModalOpen(false) } />
          </Modal.Header>
          <Modal.Body>
            <ModalWrapper>
              <img src={ product.image ?? "" } alt={ product.name } />

              <div className="product-info">
                <p className="product-name">{ product.name }</p>
                <p className="product-price">{ "$" + (product.price / 100).toFixed(2) }</p>
              </div>
            </ModalWrapper>
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
