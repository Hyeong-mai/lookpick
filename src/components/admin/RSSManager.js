import React, { useState } from 'react';
import styled from 'styled-components';
import { downloadRSSFeed, generateRSSFeed } from '../../utils/rssGenerator';

const RSSManagerContainer = styled.div`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
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

const RSSManager = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(null);

  const handleGenerateRSS = async () => {
    setIsGenerating(true);
    try {
      const rssXML = await generateRSSFeed();
      if (rssXML) {
        setLastGenerated(new Date().toLocaleString('ko-KR'));
        alert('RSS 피드가 성공적으로 생성되었습니다!');
      } else {
        alert('RSS 피드 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('RSS 생성 오류:', error);
      alert('RSS 피드 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadRSS = async () => {
    setIsGenerating(true);
    try {
      await downloadRSSFeed();
    } catch (error) {
      console.error('RSS 다운로드 오류:', error);
      alert('RSS 피드 다운로드 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenRSSFeed = () => {
    const rssUrl = `${window.location.origin}/rss.xml`;
    window.open(rssUrl, '_blank');
  };

  return (
    <RSSManagerContainer>
      <Title>RSS 피드 관리</Title>
      <Description>
        승인된 서비스들의 RSS 피드를 생성하고 관리할 수 있습니다. 
        RSS 피드는 자동으로 최신 20개의 승인된 서비스를 포함합니다.
      </Description>

      <ButtonGroup>
        <PrimaryButton 
          onClick={handleGenerateRSS}
          disabled={isGenerating}
        >
          {isGenerating ? 'RSS 생성 중...' : 'RSS 피드 생성'}
        </PrimaryButton>
        
        <SecondaryButton 
          onClick={handleDownloadRSS}
          disabled={isGenerating}
        >
          RSS 파일 다운로드
        </SecondaryButton>
        
        <SecondaryButton onClick={handleOpenRSSFeed}>
          RSS 피드 보기
        </SecondaryButton>
      </ButtonGroup>

      {lastGenerated && (
        <InfoBox>
          <InfoTitle>마지막 생성 시간</InfoTitle>
          <InfoText>{lastGenerated}</InfoText>
        </InfoBox>
      )}

      <InfoBox>
        <InfoTitle>RSS 피드 주소</InfoTitle>
        <InfoText>다음 주소로 RSS 피드에 접근할 수 있습니다:</InfoText>
        <URLBox>{window.location.origin}/rss.xml</URLBox>
        <URLBox>{window.location.origin}/feed.xml</URLBox>
      </InfoBox>

      <InfoBox>
        <InfoTitle>RSS 피드 정보</InfoTitle>
        <InfoText>
          • 최신 승인된 서비스 20개 포함<br/>
          • 자동으로 Firebase 데이터베이스에서 실시간 업데이트<br/>
          • 표준 RSS 2.0 형식으로 생성<br/>
          • 검색 엔진 및 RSS 리더기에서 자동 감지 가능
        </InfoText>
      </InfoBox>
    </RSSManagerContainer>
  );
};

export default RSSManager;
