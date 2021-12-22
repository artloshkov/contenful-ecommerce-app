import React  from 'react';
import { act, render } from '@testing-library/react';
import { CartContextProvider, CartContext, State as CartState, PRODUCTS } from "./CartContext";
import { MockedProvider } from '@apollo/client/testing';
import { MockedResponse } from "@apollo/client/utilities/testing/mocking/mockLink";

const productData = [{
  description: "Lorem ipsum dolor sit amet.",
  id: "1",
  image: "/img/test.png",
  name: "Test Product 1",
  price: 1234,
  slug: "test-product-1",
  stock: 100,
}];

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

const getCartContext = (mocks: ReadonlyArray<MockedResponse> = []): () => CartState => {
  let context: CartState | null = null;

  render(
    <MockedProvider mocks={ mocks } addTypename={false}>
      <CartContextProvider>
        <CartContext.Consumer>
          { value => {
            context = value ?? null;
            return null;
          }}
        </CartContext.Consumer>
      </CartContextProvider>
    </MockedProvider>
  );

  return () => {
    if (!context) {
      throw new Error("Context is null!!!");
    }

    return context;
  };
};

describe('CartContextProvider', () => {
  it('can get an amount of products in cart', () => {
    const { productsTotalCount } = getCartContext()();

    expect(productsTotalCount).toEqual(0);
  });

  it('can add a product to cart', async () => {
    const contextFunction = getCartContext();
    const { addProduct } = contextFunction();

    await act(async () => {
      addProduct(1, 3);
    });

    const { productsTotalCount } = contextFunction();

    expect(productsTotalCount).toEqual(3);
  });

  it('can remove a product from cart', async () => {
    const contextFunction = getCartContext();
    const { removeProduct } = contextFunction();

    await act(async () => {
      removeProduct(1, 1);
    });

    const { productsTotalCount } = contextFunction();

    expect(productsTotalCount).toEqual(2);
  });

  it('can get productsInCart array', async () => {
    const { productsInCart } = getCartContext()();

    await act(async () => {
      new Promise(resolve => setTimeout(resolve, 100)); // wait for response
    });
    
    expect(productsInCart).toEqual({ "1": 2 });
  });

  it('can set a specific product\'s quantity', async () => {
    const contextFunction = getCartContext();
    const { setProductQuantity } = contextFunction();

    await act(async () => {
      setProductQuantity(1, 5);
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    const { productsTotalCount } = contextFunction();

    expect(productsTotalCount).toEqual(5);
  });

  it('can get productsInfo array', async () => {
    const contextFunction = getCartContext(mockData);

    await act(async () => {
      new Promise(resolve => setTimeout(resolve, 100)); // wait for response
    });

    const { productsInfo } = contextFunction();

    expect(productsInfo).toEqual(productData);
  });

  it('can get cart total', async () => {
    const contextFunction = getCartContext(mockData);

    await act(async () => {
      new Promise(resolve => setTimeout(resolve, 100)); // wait for response
    });

    const { getCartTotal } = contextFunction();

    expect(getCartTotal()).toEqual(6170);
  });

  it('can clear cart', async () => {
    const contextFunction = getCartContext();
    const { clearCart } = contextFunction();

    await act(async () => {
      clearCart();
    });

    const { productsTotalCount } = contextFunction();

    expect(productsTotalCount).toEqual(0);
  });
});
