import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  // padding: ${(props) => props.theme.spacing.lg} 0;
  
  ${(props) => props.theme.media.tablet} {
    padding: ${(props) => props.theme.spacing.md} 0;
  }
  
  ${(props) => props.theme.media.mobile} {
    padding: ${(props) => props.theme.spacing.sm} 0;
  }
`;

const Layout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </LayoutContainer>
  );
};

export default Layout;
