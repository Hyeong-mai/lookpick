import React from "react";
import styled from "styled-components";

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: ${(props) => props.height || 'auto'};
  overflow: hidden;
  border-radius: ${(props) => props.borderRadius || props.theme.borderRadius.md};
  
  ${(props) => props.theme.media.mobile} {
    height: ${(props) => props.mobileHeight || props.height || 'auto'};
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${(props) => props.objectFit || 'cover'};
  transition: transform 0.3s ease;
  
  ${(props) => props.hover && `
    &:hover {
      transform: scale(1.05);
    }
  `}
`;

const ResponsiveImage = ({
  src,
  alt,
  height,
  mobileHeight,
  objectFit = 'cover',
  borderRadius,
  hover = false,
  className,
  ...props
}) => {
  return (
    <ImageContainer 
      height={height} 
      mobileHeight={mobileHeight}
      borderRadius={borderRadius}
      className={className}
    >
      <StyledImage
        src={src}
        alt={alt}
        objectFit={objectFit}
        hover={hover}
        {...props}
      />
    </ImageContainer>
  );
};

export default ResponsiveImage;
