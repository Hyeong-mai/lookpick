import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Footer from "./Footer";
import FloatingChat from "../chat/FloatingChat";
import { useAuth } from "../../../core/contexts/AuthContext";

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
  const { isLoggedIn } = useAuth();

  return (
    <LayoutContainer>
      <Header />
      <Main>{children}</Main>
      <Footer />
      {isLoggedIn && <FloatingChat />}
    </LayoutContainer>
  );
};

export default Layout;
