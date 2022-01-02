import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import _ from "lodash";
import { nullable, optional } from "../utils/common";
import { IProduct, ProductCollection } from "../Product";
import { gql, useQuery } from "@apollo/client";

interface CartProducts {
  [ key: string ]: number,
}

export interface State {
  productsInCart: CartProducts,
  productsInfo: IProduct[],
  productsTotalCount: number,
  addProduct: (id: number, count: number) => void,
  removeProduct: (id: number, count: number) => void,
  setProductQuantity: (id: number, count: nullable<number>) => void,
  clearCart: () => void,
  getCartTotal: () => number,
}

interface CartProductVars {
  ids: number[],
}

export const PRODUCTS = gql`
  query getAllProducts($ids: [Int]!) {
    getAllProducts(ids: $ids) {
      id,
      name,
      slug,
      description,
      image,
      price,
      stock
    }
  }
`;

export const CartContext = React.createContext<optional<State>>(undefined);

export const CartContextProvider = ({ children }: { children: JSX.Element}) =>
{
  const [ productsInCart, setProductsInCart ] = useState<CartProducts>({});
  const [ productsInfo, setProductsInfo ] = useState<IProduct[]>([]);

  const { data } = useQuery<ProductCollection, CartProductVars>(
    PRODUCTS,
    { variables: { ids: Object.keys(productsInCart).map(x => parseInt(x)) }, }
  );

  useEffect(() => {
    const products = localStorage.getItem("products");
    if (products) {
      setProductsInCart(JSON.parse(products));
    }
  }, []);

  useEffect(() => {
    setProductsInfo(oldProductsInfo => data ? data.getAllProducts : oldProductsInfo);
  }, [ data ]);

  const productsTotalCount = useMemo(() => Object.values(productsInCart).reduce((accumulator, num) => accumulator + num, 0), [ productsInCart ]);

  const setProductsWithLocalStorage = useCallback((products: CartProducts) => {
    setProductsInCart(products);
    localStorage.setItem("products", JSON.stringify(products));
  }, []);

  const addProduct = useCallback((id, count) => {
    let newProducts = { ...productsInCart };

    if (productsInCart.hasOwnProperty(id)) {
      newProducts[id] += count;
    } else {
      newProducts[id] = count;
    }

    setProductsWithLocalStorage(newProducts);
  }, [ productsInCart, setProductsWithLocalStorage ]);

  const removeProduct = useCallback((id, count) => {
    let newProducts = { ...productsInCart };

    if (!productsInCart.hasOwnProperty(id)) {
      throw new Error("There is no product with id `" + id + "` in cart!");
    }

    if (productsInCart[id] < count) {
      throw new Error("There are not enough products with id `" + id + "` in cart to remove them!");
    }

    if (productsInCart[id] === count) {
      newProducts = _.omit(newProducts, id);
    } else {
      // productsInCart[id] > count
      newProducts[id] -= count;
    }

    setProductsWithLocalStorage(newProducts);
  }, [ productsInCart, setProductsWithLocalStorage ]);

  const setProductQuantity = useCallback((id, count) => {
    let newProducts = { ...productsInCart };
    newProducts[id] = count;
    setProductsWithLocalStorage(newProducts);
  }, [ productsInCart, setProductsWithLocalStorage ]);

  const clearCart = useCallback(() => setProductsWithLocalStorage({}), [ setProductsWithLocalStorage ]);

  const getCartTotal = useCallback(() => {
    if (productsInfo.length === 0) {
      return 0;
    }

    return Object.keys(productsInCart).reduce((total: number, productId: string) => {
      const id = Number(productId);
      const product = _.find(productsInfo, product => parseInt(product.id) === id);

      // istanbul ignore if
      if (!product) {
        throw new Error("There is no product with id `" + id + "`!");
      }

      return total + productsInCart[id] * product.price;
    }, 0);
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
    throw new Error("CartContext must be within CartProvider");
  }

  return cartContext;
};

export default useCartContext;
