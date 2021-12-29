import React, { Fragment } from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import useCartContext, { CartContextProvider, PRODUCTS } from "./CartContext";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";

const testProduct = {
  description: "Lorem ipsum dolor sit amet.",
  id: 1,
  image: "/img/test.png",
  name: "Test Product 1",
  price: 1234,
  slug: "test-product-1",
  stock: 100,
};
const productData = [testProduct];

const mockData = [
  {
    request: {
      query: PRODUCTS,
      variables: {
        ids: [ 1 ],
      },
    },
    result: {
      data: {
        getAllProducts: productData,
      },
    },
  },
];

interface CartContextWrapperProps {
  children: JSX.Element,
  mocks: ReadonlyArray<MockedResponse>,
}

const cartContextWrapper = ({ children, mocks = [] }: CartContextWrapperProps) =>
  <MockedProvider mocks={ mocks } addTypename={ false }>
    <CartContextProvider>
      { children }
    </CartContextProvider>
  </MockedProvider>
;

const getCartContext = (mocks: ReadonlyArray<MockedResponse> = []) => {
  const { result } = renderHook(useCartContext, {
    wrapper: cartContextWrapper,
    initialProps: {
      mocks: mocks,
      children: <Fragment></Fragment>,
    }
  });

  return result;
};

describe("CartContextProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("can get an amount of products in cart", () => {
    const cartContext = getCartContext();

    expect(cartContext.current.productsTotalCount).toEqual(0);
  });

  it("can add a product to cart", async () => {
    const cartContext = getCartContext();

    await act(async () => {
      cartContext.current.addProduct(testProduct.id, 3);
    });

    expect(cartContext.current.productsTotalCount).toEqual(3);
  });

  it("can remove a product from cart", async () => {
    const cartContext = getCartContext();

    await act(async () => {
      await cartContext.current.addProduct(testProduct.id, 3);
      await cartContext.current.removeProduct(testProduct.id, 1);
    });

    expect(cartContext.current.productsTotalCount).toEqual(2);
  });

  it("can not remove a product from cart if it is not there", async () => {
    const cartContext = getCartContext();

    expect(() => cartContext.current.removeProduct(testProduct.id, 1)).toThrow();
  });

  it("can get productsInCart array", async () => {
    const cartContext = getCartContext();

    await act(async () => {
      await cartContext.current.addProduct(testProduct.id, 3);
      new Promise(resolve => setTimeout(resolve, 100)); // wait for response
    });

    expect(cartContext.current.productsInCart).toEqual({ [testProduct.id]: 3 });
  });

  it("can set a specific product's quantity", async () => {
    const cartContext = getCartContext();

    await act(async () => {
      await cartContext.current.addProduct(testProduct.id, 1);
      await cartContext.current.setProductQuantity(testProduct.id, 5);
    });

    expect(cartContext.current.productsTotalCount).toEqual(5);
  });

  it("can get productsInfo array", async () => {
    const cartContext = getCartContext(mockData);

    await act(async () => {
      cartContext.current.addProduct(Number(testProduct.id), 1); // We need to add a product to cart to have Apollo Query for it before it is added to the productsInfo array
      new Promise(resolve => setTimeout(resolve, 100)); // wait for response
    });

    expect(cartContext.current.productsInfo).toEqual(productData);
  });

  it("can get cart total", async () => {
    const cartContext = getCartContext(mockData);
    const numberOfProducts = 5;

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100)); // wait for response
      cartContext.current.addProduct(Number(testProduct.id), numberOfProducts);
    });

    expect(cartContext.current.getCartTotal()).toEqual(testProduct.price * numberOfProducts);
  });

  it("can clear cart", async () => {
    const cartContext = getCartContext();

    await act(async () => {
      await cartContext.current.addProduct(testProduct.id, 3);
      await cartContext.current.clearCart();
    });

    expect(cartContext.current.productsTotalCount).toEqual(0);
  });
});
