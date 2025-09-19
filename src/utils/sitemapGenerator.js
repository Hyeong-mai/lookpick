import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// 사이트맵 생성 함수
export const generateSitemap = async () => {
  try {
    const baseUrl = "https://lookpick.co.kr";
    const currentDate = new Date().toISOString();
    
    // 정적 페이지들
    const staticPages = [
      {
        loc: `${baseUrl}/`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '1.0'
      },
      {
        loc: `${baseUrl}/login`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        loc: `${baseUrl}/signup`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      },
      {
        loc: `${baseUrl}/service-register`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: '0.8'
      },
      {
        loc: `${baseUrl}/mypage`,
        lastmod: currentDate,
        changefreq: 'weekly',
        priority: '0.6'
      },
      {
        loc: `${baseUrl}/feed/rss.xml`,
        lastmod: currentDate,
        changefreq: 'daily',
        priority: '0.5'
      }
    ];

    // 카테고리 페이지들
    const categories = [
      'it-software',
      'marketing',
      'consulting', 
      'design',
      'finance',
      'education',
      'healthcare',
      'manufacturing',
      'logistics',
      'real-estate'
    ];

    const categoryPages = categories.map(category => ({
      loc: `${baseUrl}/category/${category}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    // Firebase에서 승인된 서비스들 가져오기
    const servicesQuery = query(
      collection(db, "services"),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(servicesQuery);
    const servicePages = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      servicePages.push({
        loc: `${baseUrl}/service/${doc.id}`,
        lastmod: data.updatedAt?.toDate?.()?.toISOString() || data.createdAt?.toDate?.()?.toISOString() || currentDate,
        changefreq: 'monthly',
        priority: '0.7'
      });
    });

    // 모든 페이지 합치기
    const allPages = [...staticPages, ...categoryPages, ...servicePages];

    // XML 생성
    const sitemapXML = generateSitemapXML(allPages);
    return sitemapXML;
  } catch (error) {
    console.error("사이트맵 생성 실패:", error);
    return null;
  }
};

// 사이트맵 XML 형식 생성
const generateSitemapXML = (pages) => {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

  const xmlUrls = pages.map(page => `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const xmlFooter = `
</urlset>`;

  return xmlHeader + xmlUrls + xmlFooter;
};

// 사이트맵 다운로드 함수
export const downloadSitemap = async () => {
  const sitemapXML = await generateSitemap();
  if (!sitemapXML) {
    alert("사이트맵 생성에 실패했습니다.");
    return;
  }

  // Blob 생성 및 다운로드
  const blob = new Blob([sitemapXML], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'sitemap.xml';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 사이트맵 통계 정보
export const getSitemapStats = async () => {
  try {
    const servicesQuery = query(
      collection(db, "services"),
      where("status", "==", "approved")
    );
    
    const querySnapshot = await getDocs(servicesQuery);
    const serviceCount = querySnapshot.size;
    
    const staticPageCount = 6; // 기본 정적 페이지 수
    const categoryCount = 10; // 카테고리 페이지 수
    
    return {
      totalPages: staticPageCount + categoryCount + serviceCount,
      staticPages: staticPageCount,
      categoryPages: categoryCount,
      servicePages: serviceCount,
      lastGenerated: new Date().toLocaleString('ko-KR')
    };
  } catch (error) {
    console.error("사이트맵 통계 조회 실패:", error);
    return null;
  }
};
