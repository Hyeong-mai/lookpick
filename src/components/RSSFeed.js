import React, { useEffect } from 'react';
import { generateRSSFeed } from '../utils/rssGenerator';

const RSSFeed = () => {
  useEffect(() => {
    const generateAndServeRSS = async () => {
      try {
        const rssXML = await generateRSSFeed();
        if (rssXML) {
          // RSS XML을 브라우저에 표시
          document.open();
          document.write(rssXML);
          document.close();
          
          // Content-Type을 RSS로 설정
          if (document.contentType) {
            document.contentType = 'application/rss+xml';
          }
        } else {
          document.open();
          document.write(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LookPick RSS Feed Error</title>
    <description>RSS 피드를 생성할 수 없습니다.</description>
    <link>${window.location.origin}</link>
  </channel>
</rss>`);
          document.close();
        }
      } catch (error) {
        console.error('RSS 피드 생성 오류:', error);
        document.open();
        document.write(`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>LookPick RSS Feed Error</title>
    <description>RSS 피드 생성 중 오류가 발생했습니다.</description>
    <link>${window.location.origin}</link>
  </channel>
</rss>`);
        document.close();
      }
    };

    generateAndServeRSS();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>RSS 피드를 생성하는 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
};

export default RSSFeed;
