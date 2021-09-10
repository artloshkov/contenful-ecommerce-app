import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { nullable, optional } from "../utils/common";
import { IProduct, ProductCollection } from "../Product";
import { gql, useQuery } from "@apollo/client";

interface CartProducts {
  [ key: number ]: number,
}

type State = {
  productsInCart: CartProducts,
  productsInfo: IProduct[],
  productsTotalCount: number,
  addProduct: (id: number, count: number) => void,
  removeProduct: (id: number, count: number) => void,
  setProductQuantity: (id: number, count: nullable<number>) => void,
  clearCart: () => void,
  getCartTotal: () => number,
};

interface CartProductVars {
  ids: number[],
}

const PRODUCTS = gql`
  query ProductEntry ($ids: [Int]!) {
    productCollection (where: { id_in: $ids } ) {
      items {
        id,
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

const CartContext = React.createContext<optional<State>>(undefined);

export const CartContextProvider = ({ children }: { children: JSX.Element}) =>
{
  const [ productsInCart, setProductsInCart ] = useState<CartProducts>({});
  const [ productsInfo, setProductsInfo ] = useState<IProduct[]>([]);

  const { data } = useQuery<ProductCollection, CartProductVars>(
    PRODUCTS,
    { variables: { ids: Object.keys(productsInCart).map(x => parseInt(x)) }, }
  );

  useEffect(() => {
    if (localStorage.getItem("products")) {
      setProductsInCart(JSON.parse(localStorage.getItem("products") ?? "{}"));
    }
  }, []);

  useEffect(() => {
    setProductsInfo(oldProductsInfo => data ? data.productCollection.items : oldProductsInfo);
  }, [ data ]);

  const productsTotalCount = useMemo(() => Object.values(productsInCart).reduce((accumulator, num) => accumulator + num, 0), [ productsInCart ]);

  const setProductsWithLocalStorage = useCallback((products: CartProducts) => {
    setProductsInCart(products);
    localStorage.setItem("products", JSON.stringify(products));
  }, []);

  const addProduct = useCallback((id, count) => {
    let newProducts = Object.assign({}, productsInCart);

    if (id in productsInCart) {
      newProducts[id] += count;
    } else {
      newProducts[id] = count;
    }

    setProductsWithLocalStorage(newProducts);
  }, [ productsInCart, setProductsWithLocalStorage ]);

  const removeProduct = useCallback((id, count) => {
    let newProducts = Object.assign({}, productsInCart);

    if (productsInCart[id] === count) {
      newProducts = _.omit(newProducts, id);
    } else {
      newProducts[id] -= count;
    }

    setProductsWithLocalStorage(newProducts);
  }, [ productsInCart, setProductsWithLocalStorage ]);

  const setProductQuantity = useCallback((id, count) => {
    let newProducts = Object.assign({}, productsInCart);
    newProducts[id] = count;
    setProductsWithLocalStorage(newProducts);
  }, [ productsInCart, setProductsWithLocalStorage ]);

  const clearCart = useCallback(() => setProductsWithLocalStorage({}), [ setProductsWithLocalStorage ]);

  const getCartTotal = useCallback(() => {
    let total = 0;
    Object.keys(productsInCart).forEach(productId => {
      const id = parseInt(productId);
      const product = _.find(productsInfo, product => product.id === id);
      if (product) {
        total += productsInCart[id] * product.price;
      }
    });

    return total;
  }, [ productsInCart, productsInfo ]);

  return (
    <CartContext.Provider value={{ productsInCart, productsInfo, productsTotalCount, addProduct, removeProduct, setProductQuantity, clearCart, getCartTotal }}>
      { children }
    </CartContext.Provider>
  );
};

const useCartContext = () => {
  const cartContext = useContext(CartContext);

  if (cartContext === undefined) {
    throw new Error("CartContext must be within CartProvider")
  }

  return cartContext;
};

export default useCartContext;
