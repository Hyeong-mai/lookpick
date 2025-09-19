import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// RSS 피드 생성 함수
export const generateRSSFeed = async () => {
  try {
    // Firebase에서 승인된 게시물 가져오기
    const servicesQuery = query(
      collection(db, "services"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc"),
      limit(20) // 최신 20개 게시물
    );

    const querySnapshot = await getDocs(servicesQuery);
    const posts = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({
        id: doc.id,
        title: data.serviceName || "제목 없음",
        description: data.serviceDescription || "설명 없음",
        link: `${window.location.origin}/service/${doc.id}`,
        pubDate: data.createdAt?.toDate?.() || new Date(),
        category: data.categories?.[0] || "일반",
        author: data.companyName || "LookPick",
      });
    });

    // RSS XML 생성
    const rssXML = generateRSSXML(posts);
    return rssXML;
  } catch (error) {
    console.error("RSS 피드 생성 실패:", error);
    return null;
  }
};

// RSS XML 형식 생성
const generateRSSXML = (posts) => {
  const currentDate = new Date().toUTCString();
  const siteUrl = window.location.origin;

  const rssHeader = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>LookPick - B2B 서비스 플랫폼</title>
    <description>비즈니스를 가장 빠르게 찾을 수 있는 통합 B2B 검색·연결 플랫폼</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>ko-KR</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <generator>LookPick RSS Generator</generator>
    <webMaster>admin@lookpick.co.kr (LookPick Admin)</webMaster>
    <copyright>Copyright ${new Date().getFullYear()} LookPick. All rights reserved.</copyright>
    <category>Business</category>
    <ttl>60</ttl>`;

  const rssItems = posts.map(post => {
    const pubDate = post.pubDate instanceof Date ? post.pubDate.toUTCString() : new Date(post.pubDate).toUTCString();
    
    return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${post.link}</link>
      <guid isPermaLink="true">${post.link}</guid>
      <pubDate>${pubDate}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      <author><![CDATA[${post.author}]]></author>
    </item>`;
  }).join('');

  const rssFooter = `
  </channel>
</rss>`;

  return rssHeader + rssItems + rssFooter;
};

// RSS 피드 다운로드 함수
export const downloadRSSFeed = async () => {
  const rssXML = await generateRSSFeed();
  if (!rssXML) {
    alert("RSS 피드 생성에 실패했습니다.");
    return;
  }

  // Blob 생성 및 다운로드
  const blob = new Blob([rssXML], { type: 'application/rss+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'lookpick-rss.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
