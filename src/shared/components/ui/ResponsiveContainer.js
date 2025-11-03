import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 ${(props) => props.theme.spacing.md};
  
  ${(props) => props.theme.media.tablet} {
    max-width: ${(props) => props.theme.container.tablet};
    padding: 0 ${(props) => props.theme.spacing.sm};
  }
  
  ${(props) => props.theme.media.desktop} {
    max-width: ${(props) => props.theme.container.desktop};
    padding: 0 ${(props) => props.theme.spacing.md};
  }
  
  ${(props) => props.theme.media.large} {
    max-width: ${(props) => props.theme.container.large};
    padding: 0 ${(props) => props.theme.spacing.lg};
  }
  
  ${(props) => props.theme.media.xl} {
    max-width: ${(props) => props.theme.container.xl};
    padding: 0 ${(props) => props.theme.spacing.lg};
  }
`;

const ResponsiveContainer = ({ children, className, ...props }) => {
  return (
    <Container className={className} {...props}>
      {children}
    </Container>
  );
};

export default ResponsiveContainer;

