import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import apolloClientConfig from "./utils/apolloClientConfig";
import Home from "./Home";
import NotFoundPage from "./NotFoundPage";
import Category from "./Category";
import Product from "./Product";
import Cart from "./Cart";
import Categories from "./Categories";
import Checkout from "./Checkout";
import { CartContextProvider } from "./contexts/CartContext";
import { ThemeProvider } from "styled-components";

const theme = {
  greyColor: "#595959",
  greyDarkColor: "#2b2b2b",
};

const App = () => {
  return (
    <ApolloProvider client={ apolloClientConfig }>
      <ThemeProvider theme={ theme }>
        <CartContextProvider>
          <Router>
            <Routes>
              <Route path="/" element={ <Home /> } />
              <Route path="/not-found" element={ <NotFoundPage /> } />
              <Route path="/cart" element={ <Cart /> } />
              <Route path="/checkout" element={ <Checkout /> } />
              <Route path="/categories" element={ <Categories /> } />
              <Route path='/:categorySlug/:productSlug' element={ <Product /> } />
              <Route path='/:categorySlug' element={ <Category /> } />
              <Route element={ <NotFoundPage /> } />
            </Routes>
          </Router>
        </CartContextProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
