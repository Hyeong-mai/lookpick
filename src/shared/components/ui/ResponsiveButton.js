import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.gap || props.theme.spacing.xs};
  padding: ${(props) => props.padding || `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
  font-size: ${(props) => props.fontSize || props.theme.fontSize.base};
  font-weight: ${(props) => props.fontWeight || 500};
  border: none;
  border-radius: ${(props) => props.borderRadius || props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
  min-height: ${(props) => props.minHeight || 'auto'};
  min-width: ${(props) => props.minWidth || 'auto'};
  
  /* 버튼 타입별 스타일 */
  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.gradients.primary};
          color: white;
          box-shadow: 0 4px 15px rgba(115, 102, 255, 0.3);
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(115, 102, 255, 0.4);
          }
        `;
      case 'secondary':
        return `
          background: white;
          color: ${props.theme.colors.dark};
          border: 2px solid ${props.theme.colors.gray[300]};
          
          &:hover {
            border-color: ${props.theme.colors.primary};
            color: ${props.theme.colors.primary};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${props.theme.colors.primary};
          border: 2px solid ${props.theme.colors.primary};
          
          &:hover {
            background: ${props.theme.colors.primary};
            color: white;
          }
        `;
      default:
        return `
          background: ${props.theme.colors.gray[200]};
          color: ${props.theme.colors.dark};
          
          &:hover {
            background: ${props.theme.colors.gray[300]};
          }
        `;
    }
  }}
  
  /* 크기별 스타일 */
  ${(props) => {
    switch (props.size) {
      case 'small':
        return `
          padding: ${props.theme.spacing.xs} ${props.theme.spacing.sm};
          font-size: ${props.theme.fontSize.sm};
        `;
      case 'large':
        return `
          padding: ${props.theme.spacing.md} ${props.theme.spacing.xl};
          font-size: ${props.theme.fontSize.lg};
        `;
      default:
        return '';
    }
  }}
  
  /* 비활성화 상태 */
  ${(props) => props.disabled && `
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  /* 전체 너비 */
  ${(props) => props.fullWidth && `
    width: 100%;
  `}
  
  /* 태블릿 반응형 */
  ${(props) => props.theme.media.tablet} {
    padding: ${(props) => props.tabletPadding || props.padding || `${props.theme.spacing.sm} ${props.theme.spacing.md}`};
    font-size: ${(props) => props.tabletFontSize || props.fontSize || props.theme.fontSize.sm};
    gap: ${(props) => props.tabletGap || props.gap || props.theme.spacing.xs};
  }
  
  /* 모바일 반응형 */
  ${(props) => props.theme.media.mobile} {
    padding: ${(props) => props.mobilePadding || props.tabletPadding || props.padding || `${props.theme.spacing.xs} ${props.theme.spacing.sm}`};
    font-size: ${(props) => props.mobileFontSize || props.tabletFontSize || props.fontSize || props.theme.fontSize.xs};
    gap: ${(props) => props.mobileGap || props.tabletGap || props.gap || props.theme.spacing.xs};
    min-height: 44px;
    min-width: 44px;
  }
  
  /* 터치 디바이스 최적화 */
  @media (hover: none) and (pointer: coarse) {
    min-height: 44px;
    min-width: 44px;
  }
`;

const ResponsiveButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  padding,
  tabletPadding,
  mobilePadding,
  fontSize,
  tabletFontSize,
  mobileFontSize,
  gap,
  tabletGap,
  mobileGap,
  borderRadius,
  fontWeight,
  minHeight,
  minWidth,
  fullWidth = false,
  disabled = false,
  className,
  ...props
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      padding={padding}
      tabletPadding={tabletPadding}
      mobilePadding={mobilePadding}
      fontSize={fontSize}
      tabletFontSize={tabletFontSize}
      mobileFontSize={mobileFontSize}
      gap={gap}
      tabletGap={tabletGap}
      mobileGap={mobileGap}
      borderRadius={borderRadius}
      fontWeight={fontWeight}
      minHeight={minHeight}
      minWidth={minWidth}
      fullWidth={fullWidth}
      disabled={disabled}
      className={className}
      {...props}
    >
      {children}
    </ButtonContainer>
  );
};

export default ResponsiveButton;

