import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import ModalCloseButton from "../js/UI/ModalCloseButton";

export default {
  title: "Example/ModalCloseButton",
  component: ModalCloseButton,
} as ComponentMeta<typeof ModalCloseButton>;

export const ModalCloseButtonTemplate: ComponentStory<typeof ModalCloseButton> = () => <ModalCloseButton onClick={ () => console.log("test") } />;
