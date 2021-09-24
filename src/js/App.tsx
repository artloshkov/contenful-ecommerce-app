import {
  BrowserRouter as Router,
  Route,
  Switch
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
            <Switch>
              <Route path="/" exact component={ Home } />
              <Route path="/not-found" exact component={ NotFoundPage } />
              <Route path="/cart" exact component={ Cart } />
              <Route path="/checkout" exact component={ Checkout } />
              <Route path="/categories" exact component={ Categories } />
              <Route path='/:categorySlug/:productSlug' component={ Product } />
              <Route path='/:categorySlug' component={ Category } />
              <Route component={ NotFoundPage } />
            </Switch>
          </Router>
        </CartContextProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
