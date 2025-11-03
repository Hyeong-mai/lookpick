import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { downloadSitemap, generateSitemap, getSitemapStats } from '../../utils/sitemapGenerator';

const SitemapManagerContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  color: ${props => props.theme.colors.black};
  font-size: 1.5rem;
  font-weight: 700;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.gray[600]};
  margin-bottom: 24px;
  line-height: 1.6;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${props => props.theme.colors.gray[50]};
  border-radius: 8px;
  padding: 16px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.black};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray[600]};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: ${props => props.theme.gradients.primary};
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(115, 102, 255, 0.3);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: ${props => props.theme.colors.black};
  border: 2px solid ${props => props.theme.colors.gray[300]};
  
  &:hover:not(:disabled) {
    border-color: ${props => props.theme.colors.gray[400]};
    background: ${props => props.theme.colors.gray[50]};
  }
`;

const InfoBox = styled.div`
  background: ${props => props.theme.colors.gray[50]};
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
`;

const InfoTitle = styled.h4`
  margin: 0 0 8px 0;
  color: ${props => props.theme.colors.black};
  font-size: 1.1rem;
`;

const InfoText = styled.p`
  margin: 0;
  color: ${props => props.theme.colors.gray[600]};
  font-size: 0.9rem;
  line-height: 1.5;
`;

const URLBox = styled.div`
  background: ${props => props.theme.colors.gray[100]};
  border-radius: 6px;
  padding: 12px;
  margin-top: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.black};
  word-break: break-all;
`;

const SitemapManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [stats, setStats] = useState(null);
  const [lastGenerated, setLastGenerated] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const sitemapStats = await getSitemapStats();
      setStats(sitemapStats);
    } catch (error) {
      console.error('사이트맵 통계 로드 실패:', error);
    }
  };

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    try {
      const sitemapXML = await generateSitemap();
      if (sitemapXML) {
        setLastGenerated(new Date().toLocaleString('ko-KR'));
        await loadStats(); // 통계 새로고침
        alert('사이트맵이 성공적으로 생성되었습니다!');
      } else {
        alert('사이트맵 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('사이트맵 생성 오류:', error);
      alert('사이트맵 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadSitemap = async () => {
    setIsGenerating(true);
    try {
      await downloadSitemap();
    } catch (error) {
      console.error('사이트맵 다운로드 오류:', error);
      alert('사이트맵 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenSitemap = () => {
    const sitemapUrl = `${window.location.origin}/sitemap.xml`;
    window.open(sitemapUrl, '_blank');
  };

  const handleOpenRobotsTxt = () => {
    const robotsUrl = `${window.location.origin}/robots.txt`;
    window.open(robotsUrl, '_blank');
  };

  return (
    <SitemapManagerContainer>
      <Title>사이트맵 관리</Title>
      <Description>
        웹사이트의 사이트맵을 생성하고 관리할 수 있습니다. 
        사이트맵은 검색 엔진이 사이트 구조를 이해하는 데 도움을 줍니다.
      </Description>

      {stats && (
        <StatsGrid>
          <StatCard>
            <StatNumber>{stats.totalPages}</StatNumber>
            <StatLabel>전체 페이지</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.staticPages}</StatNumber>
            <StatLabel>정적 페이지</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.categoryPages}</StatNumber>
            <StatLabel>카테고리 페이지</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.servicePages}</StatNumber>
            <StatLabel>서비스 페이지</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <ButtonGroup>
        <PrimaryButton 
          onClick={handleGenerateSitemap}
          disabled={isGenerating}
        >
          {isGenerating ? '사이트맵 생성 중...' : '사이트맵 생성'}
        </PrimaryButton>
        
        <SecondaryButton 
          onClick={handleDownloadSitemap}
          disabled={isGenerating}
        >
          사이트맵 다운로드
        </SecondaryButton>
        
        <SecondaryButton onClick={handleOpenSitemap}>
          사이트맵 보기
        </SecondaryButton>

        <SecondaryButton onClick={handleOpenRobotsTxt}>
          robots.txt 보기
        </SecondaryButton>
      </ButtonGroup>

      {lastGenerated && (
        <InfoBox>
          <InfoTitle>마지막 생성 시간</InfoTitle>
          <InfoText>{lastGenerated}</InfoText>
        </InfoBox>
      )}

      <InfoBox>
        <InfoTitle>사이트맵 및 SEO 파일</InfoTitle>
        <InfoText>다음 주소로 사이트맵과 robots.txt에 접근할 수 있습니다:</InfoText>
        <URLBox>{window.location.origin}/sitemap.xml</URLBox>
        <URLBox>{window.location.origin}/robots.txt</URLBox>
      </InfoBox>

      <InfoBox>
        <InfoTitle>사이트맵 정보</InfoTitle>
        <InfoText>
          • 정적 페이지: 메인, 로그인, 회원가입, 서비스 등록 등<br/>
          • 카테고리 페이지: IT/소프트웨어, 마케팅, 컨설팅 등<br/>
          • 서비스 페이지: 승인된 모든 서비스 자동 포함<br/>
          • 자동 업데이트: Firebase 데이터베이스와 실시간 동기화<br/>
          • 검색 엔진 최적화: Google, Bing 등 주요 검색 엔진 지원
        </InfoText>
      </InfoBox>
    </SitemapManagerContainer>
  );
};

export default SitemapManager;
