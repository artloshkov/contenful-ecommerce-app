import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import CartIcon from "../js/UI/CartIcon";
import { theme } from "../js/App";

export default {
  title: "Example/CartIcon",
  component: CartIcon,
} as ComponentMeta<typeof CartIcon>;

export const CartIconTemplate: ComponentStory<typeof CartIcon> = () =>
  <ThemeProvider theme={ theme }>
    <Router>
      <CartIcon productsNumber={5} />
    </Router>
  </ThemeProvider>
;
