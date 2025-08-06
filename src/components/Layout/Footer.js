import React from "react";
import styled from "styled-components";

const FooterContainer = styled.footer`
  padding: 40px 20px;
  background-color: ${(props) => props.theme.colors.gray[100]};
  margin-top: auto;
`;

const FooterContent = styled.div`
  text-align: center;
  color: ${(props) => props.theme.colors.gray[600]};
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <p>&copy; 2024 LookPick. All rights reserved.</p>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
