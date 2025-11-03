import React from "react";
import styled from "styled-components";

const GridContainer = styled.div`
  display: grid;
  gap: ${(props) => props.gap || props.theme.gap.md};
  
  /* 기본 그리드 설정 */
  grid-template-columns: ${(props) => {
    if (props.columns) {
      return `repeat(${props.columns}, 1fr)`;
    }
    if (props.cols) {
      return `repeat(${props.cols}, 1fr)`;
    }
    return "1fr";
  }};
  
  /* 태블릿 반응형 */
  ${(props) => props.theme.media.tablet} {
    grid-template-columns: ${(props) => {
      if (props.tabletCols) {
        return `repeat(${props.tabletCols}, 1fr)`;
      }
      if (props.columns && props.columns > 2) {
        return "repeat(2, 1fr)";
      }
      return "1fr";
    }};
    gap: ${(props) => props.tabletGap || props.gap || props.theme.gap.sm};
  }
  
  /* 모바일 반응형 */
  ${(props) => props.theme.media.mobile} {
    grid-template-columns: ${(props) => {
      if (props.mobileCols) {
        return `repeat(${props.mobileCols}, 1fr)`;
      }
      return "1fr";
    }};
    gap: ${(props) => props.mobileGap || props.gap || props.theme.gap.xs};
  }
`;

const GridItem = styled.div`
  /* 그리드 아이템 기본 스타일 */
  ${(props) => props.fullWidth && `
    grid-column: 1 / -1;
  `}
  
  ${(props) => props.span && `
    grid-column: span ${props.span};
  `}
  
  /* 태블릿에서 span 조정 */
  ${(props) => props.theme.media.tablet} {
    ${(props) => props.tabletSpan && `
      grid-column: span ${props.tabletSpan};
    `}
  }
  
  /* 모바일에서 span 조정 */
  ${(props) => props.theme.media.mobile} {
    ${(props) => props.mobileSpan && `
      grid-column: span ${props.mobileSpan};
    `}
  }
`;

const ResponsiveGrid = ({ 
  children, 
  columns, 
  cols, 
  tabletCols, 
  mobileCols,
  gap,
  tabletGap,
  mobileGap,
  className,
  ...props 
}) => {
  return (
    <GridContainer
      columns={columns}
      cols={cols}
      tabletCols={tabletCols}
      mobileCols={mobileCols}
      gap={gap}
      tabletGap={tabletGap}
      mobileGap={mobileGap}
      className={className}
      {...props}
    >
      {children}
    </GridContainer>
  );
};

ResponsiveGrid.Item = GridItem;

export default ResponsiveGrid;

