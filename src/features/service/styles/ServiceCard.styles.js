import styled from 'styled-components';

export const ServiceCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 600px;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    border-color: #cbd5e1;
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }

  @media (max-width: 768px) {
    height: auto;
  }
`;

export const PlaceholderCard = styled(ServiceCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 32px;
  color: #1e293b;
  background: #f8fafc;
  border: 2px dashed #94a3b8;
  box-shadow: none;
  gap: 20px;

  &:hover {
    transform: none;
    border-color: #64748b;
    box-shadow: none;
  }
`;

export const PlaceholderBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.1);
  color: #0f172a;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const PlaceholderTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 800;
  line-height: 1.4;
  color: #0f172a;
  margin: 0;
`;

export const PlaceholderDescription = styled.p`
  font-size: 0.95rem;
  line-height: 1.7;
  color: #475569;
  margin: 0;
  max-width: 320px;
`;

export const ServiceThumbnail = styled.div`
  width: 100%;
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
  margin: 0;
  padding: 0;
  background: #f8fafc;
  transition: height 0.3s ease;
  
  ${ServiceCard}:hover & {
    height: 120px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    margin: 0;
    padding: 0;
    vertical-align: top;
  }

  @media (max-width: 768px) {
    height: 200px;
  }
`;

export const CategoryBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-start;
  z-index: 10;
`;

export const CategoryLabel = styled.span`
  background: #ffffff;
  color: #000000;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`;

export const VerifiedBadge = styled.div`
  position: absolute;
  bottom: 12px;
  left: 12px;
  background: #0ea5e9;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.4);
  z-index: 10;
  
  ion-icon {
    font-size: 1rem;
  }
`;

export const AdminExampleBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #0f172a;
  color: #ffffff;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  z-index: 12;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.25);
`;

export const ServiceCardContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ServiceTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

export const CompanyNameSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  flex: 1;
`;

export const LocationSection = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #64748b;
  white-space: nowrap;
  flex-shrink: 0;
  
  ion-icon {
    font-size: 1rem;
    color: #64748b;
  }
  
  .icon {
    font-size: 0.9rem;
  }
`;

export const CompanyLogo = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: cover;
  border: 1px solid #e2e8f0;
  background: white;
  flex-shrink: 0;
`;

export const ServiceTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

export const ServiceSummary = styled.p`
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
  line-height: 1.3;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const ServiceDescription = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
  flex: 1;
  overflow: hidden;
  transition: all 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  
  ${ServiceCard}:hover & {
    -webkit-line-clamp: 6;
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const ServiceMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s ease;
`;

export const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const MetaTag = styled.span`
  background: #f1f5f9;
  color: #475569;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
`;

export const DetailedPricing = styled.div`
  display: none;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 6px;
  padding: 8px 20px 16px 20px;
  margin-top: 0;
  transition: all 0.3s ease;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  
  ${ServiceCard}:hover & {
    display: flex;
    opacity: 1;
    max-height: 300px;
  }
`;

export const PricingOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  flex: ${props => props.$isSingle ? '1' : '0 0 calc(33.333% - 6px)'};
  min-width: 0;
  transition: all 0.3s ease;
`;

export const PricingName = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 2px;
  text-align: center;
`;

export const PricingPrice = styled.span`
  font-size: 0.85rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
`;

export const ServiceFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  margin-top: auto;
  position: relative;
  transition: all 0.3s ease;
`;

export const CompanyInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const CompanyNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const CompanyName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #64748b;
  transition: color 0.2s ease;
  
  ${ServiceCard}:hover & {
    color: #475569;
  }
`;

export const ServicePrice = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  transition: display 0.2s ease;
  display: block;
  
  ${ServiceCard}:hover & {
    display: none;
  }
`;

