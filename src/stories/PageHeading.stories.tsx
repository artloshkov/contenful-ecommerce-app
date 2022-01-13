import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import PageHeading from "../js/UI/PageHeading";

export default {
  title: "Example/PageHeading",
  component: PageHeading,
} as ComponentMeta<typeof PageHeading>;

export const PageHeadingTemplate: ComponentStory<typeof PageHeading> = () => <PageHeading>Test Heading</PageHeading>;
