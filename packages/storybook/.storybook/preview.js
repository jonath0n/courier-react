import React from "react";

import { Normalize } from "styled-normalize";
import { addParameters, addDecorator } from "@storybook/react";
import { DocsPage, DocsContainer } from "@storybook/addon-docs/blocks";
import githubCss from "./github.css";
import styled from "styled-components";

const Styled = styled.div`
  ${githubCss};
  width: 900px;

  img {
    max-width: 100%;
  }
`;

addParameters({
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

addDecorator((storyFn) =>
  React.createElement(() => (
    <Styled>
      <Normalize />
      <div style={{ margin: 24 }}>{storyFn()}</div>
    </Styled>
  ))
);
