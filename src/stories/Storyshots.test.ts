import initStoryshots from "@storybook/addon-storyshots";
import { imageSnapshot } from "@storybook/addon-storyshots-puppeteer";
import "jest-styled-components";

initStoryshots({ suite: "Puppeteer storyshots", test: imageSnapshot({ storybookUrl: "http://localhost:6006/" }) });
