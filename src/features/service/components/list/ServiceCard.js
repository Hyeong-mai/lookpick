import React from 'react';
import { CATEGORIES } from '../../../../shared/constants';
import {
  ServiceCard as StyledServiceCard,
  ServiceThumbnail,
  CategoryBadge,
  CategoryLabel,
  VerifiedBadge,
  ServiceCardContent,
  ServiceTitleContainer,
  CompanyNameSection,
  ServiceTitle,
  ServiceSummary,
  ServiceDescription,
  ServiceMeta,
  MetaRow,
  MetaTag,
  ServiceFooter,
  CompanyInfo,
  CompanyNameRow,
  CompanyLogo,
  CompanyName,
  LocationSection,
  ServicePrice,
  DetailedPricing,
  PricingOption,
  PricingName,
  PricingPrice,
} from '../../styles/ServiceCard.styles';

/**
 * 서비스 카드 컴포넌트
 */
const ServiceCard = ({ service, onClick }) => {
  return (
    <div className="service-card-wrapper" style={{ position: 'relative' }}>
      <StyledServiceCard onClick={() => onClick(service)}>
        <ServiceThumbnail>
          {/* 카테고리 배지 (인증 기업이 아닌 경우만 표시) */}
          {service.userVerificationStatus !== 'verified' && service.categories && service.categories.length > 0 && (
            <CategoryBadge>
              {service.categories.slice(0, 2).map((categoryId, index) => {
                const category = CATEGORIES.find(c => c.id === categoryId);
                const categoryName = category ? category.name : categoryId;
                return (
                  <CategoryLabel key={`cat-${index}`}>{categoryName}</CategoryLabel>
                );
              })}
            </CategoryBadge>
          )}
          
          {/* 인증 기업 배지 */}
          {service.userVerificationStatus === 'verified' && (
            <VerifiedBadge>
              ✓ 인증기업
            </VerifiedBadge>
          )}
          
          {/* 썸네일 이미지 */}
          {service.thumbnail ? (
            <img
              src={service.thumbnail.url || service.thumbnail}
              alt={service.serviceName}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              backgroundColor: '#000000', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1.5rem',
              fontWeight: '600',
              textAlign: 'center',
              padding: '20px',
              wordBreak: 'keep-all',
              lineHeight: '1.4'
            }}>
              {service.serviceName}
            </div>
          )}
        </ServiceThumbnail>
        
        <ServiceCardContent>
          {/* 서비스명 */}
          <ServiceTitleContainer>
            <CompanyNameSection>
              <ServiceTitle>{service.serviceName}</ServiceTitle>
            </CompanyNameSection>
          </ServiceTitleContainer>
          
          {/* 서비스 한줄 요약 */}
          {service.serviceSummary && (
            <ServiceSummary>
              {service.serviceSummary}
            </ServiceSummary>
          )}
          
          {/* 서비스 설명 */}
          <ServiceDescription>
            {service.serviceDescription || '서비스 설명이 없습니다.'}
          </ServiceDescription>
          
          {/* 태그들 */}
          <ServiceMeta>
            <MetaRow>
              {service.tags && service.tags.slice(0, 3).map((tag, index) => (
                <MetaTag key={`tag-${index}`}>#{tag}</MetaTag>
              ))}
            </MetaRow>
          </ServiceMeta>

          {/* Footer: 회사 정보 및 가격 */}
          <ServiceFooter>
            <CompanyInfo>
              <CompanyNameRow>
                {service.companyLogo && (
                  <CompanyLogo
                    src={service.companyLogo.url || service.companyLogo}
                    alt="회사 로고"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <CompanyName>
                  {service.companyName || '회사명 미등록'}
                </CompanyName>
              </CompanyNameRow>
              {service.serviceRegion && (
                <LocationSection>
                  <ion-icon name="location-outline"></ion-icon>
                  <span>{service.serviceRegion.split(' ')[0]}</span>
                </LocationSection>
              )}
            </CompanyInfo>
            <ServicePrice>
              {service.pricingOptions && service.pricingOptions.length > 0 ? (
                service.pricingOptions[0].price ? `${service.pricingOptions[0].price}원부터` : '문의'
              ) : (
                service.price ? `${service.price}원` : '문의'
              )}
            </ServicePrice>
          </ServiceFooter>

          {/* 상세 가격 옵션 (hover 시 표시) */}
          <DetailedPricing>
            {service.pricingOptions && service.pricingOptions.length > 0 ? (
              service.pricingOptions.map((option, index) => (
                <PricingOption key={index} $isSingle={service.pricingOptions.length === 1}>
                  <PricingName>{option.name}</PricingName>
                  <PricingPrice>{option.price ? `${option.price.toLocaleString()}원` : '문의'}</PricingPrice>
                </PricingOption>
              ))
            ) : (
              <PricingOption $isSingle={true}>
                <PricingName>기본 가격</PricingName>
                <PricingPrice>{service.price ? `${service.price}원` : '문의'}</PricingPrice>
              </PricingOption>
            )}
          </DetailedPricing>
        </ServiceCardContent>
      </StyledServiceCard>
    </div>
  );
};

export default ServiceCard;

