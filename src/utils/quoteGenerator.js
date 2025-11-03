// 견적서 생성 유틸리티

/**
 * 견적서 HTML 생성
 */
export const generateQuoteHTML = (service, selectedOption, quoteFormData) => {
  const currentDate = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // 가격 정보 - 디버깅
  console.log('generateQuoteHTML - selectedOption:', selectedOption);
  console.log('generateQuoteHTML - selectedOption.price:', selectedOption?.price);
  console.log('generateQuoteHTML - service.price:', service.price);
  
  // 쉼표 제거 후 숫자 변환
  const parsePrice = (price) => {
    if (!price) return 0;
    const cleanPrice = String(price).replace(/,/g, '');
    return Number(cleanPrice) || 0;
  };
  
  const servicePrice = parsePrice(selectedOption?.price) || parsePrice(service.price) || 0;
  console.log('generateQuoteHTML - 최종 servicePrice:', servicePrice);

  return `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${service.serviceName} 서비스 견적서</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Malgun Gothic', '맑은 고딕', sans-serif;
      padding: 40px;
      background: #ffffff;
    }
    
    .quote-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border: 2px solid #000;
    }
    
    .quote-header {
      text-align: center;
      padding: 30px;
      border-bottom: 2px solid #000;
    }
    
    .quote-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    
    .quote-date {
      font-size: 14px;
      color: #333;
      margin-bottom: 10px;
    }
    
    .quote-recipient {
      font-size: 14px;
      color: #333;
      text-align: left;
      margin-top: 20px;
    }
    
    .supplier-section {
      padding: 30px;
      border-bottom: 2px solid #000;
    }
    
    .supplier-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 1px solid #ddd;
    }
    
    .supplier-info {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 10px;
      font-size: 14px;
      line-height: 1.8;
    }
    
    .info-label {
      font-weight: bold;
      color: #333;
    }
    
    .info-value {
      color: #000;
    }
    
    .subject-section {
      padding: 20px 30px;
      background: #f8f9fa;
      border-bottom: 2px solid #000;
    }
    
    .subject-title {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .subject-content {
      font-size: 14px;
      color: #333;
      line-height: 1.6;
    }
    
    .quote-details {
      padding: 30px;
      border-bottom: 2px solid #000;
    }
    
    .details-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    
    .details-table th,
    .details-table td {
      border: 1px solid #000;
      padding: 12px;
      font-size: 14px;
      text-align: center;
    }
    
    .details-table th {
      background: #f8f9fa;
      font-weight: bold;
    }
    
    .details-table td {
      background: white;
    }
    
    .text-left {
      text-align: left !important;
    }
    
    .text-right {
      text-align: right !important;
    }
    
    .total-row {
      background: #f8f9fa !important;
      font-weight: bold;
    }
    
    .remarks-section {
      padding: 30px;
    }
    
    .remarks-title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    
    .remarks-list {
      list-style: decimal;
      padding-left: 20px;
      font-size: 13px;
      line-height: 1.8;
      color: #333;
    }
    
    .service-description {
      font-size: 13px;
      color: #666;
      margin-left: 10px;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .quote-container {
        border: none;
      }
    }
  </style>
</head>
<body>
  <div class="quote-container">
    <!-- 견적서 헤더 -->
    <div class="quote-header">
      <div class="quote-title">${service.serviceName} 서비스 견적서</div>
      <div class="quote-date">${currentDate}</div>
      <div class="quote-recipient">아래와 같이 견적합니다. ${quoteFormData.companyName || 'LookPick'} 귀하</div>
    </div>
    
    <!-- 공급자 정보 -->
    <div class="supplier-section">
      <div class="supplier-title">공급자</div>
      <div class="supplier-info">
        <span class="info-label">사업자번호</span>
        <span class="info-value">${service.businessNumber || '-'}</span>
        
        <span class="info-label">상호</span>
        <span class="info-value">${service.companyName || '-'}</span>
        
        <span class="info-label">대표</span>
        <span class="info-value">${service.representative || '-'}</span>
        
        <span class="info-label">주소</span>
        <span class="info-value">${service.companyAddress || '-'}</span>
        
        <span class="info-label">연락처</span>
        <span class="info-value">${service.contactPhone || '-'}</span>
      </div>
    </div>
    
    <!-- 제목 -->
    <div class="subject-section">
      <div class="subject-title">제목</div>
      <div class="subject-content">
        ${service.serviceName} 서비스 "${selectedOption?.name || '기본'}" 요금제 견적
      </div>
    </div>
    
    <!-- 견적 명세 -->
    <div class="quote-details">
      <div class="details-title">견적명세</div>
      <table class="details-table">
        <thead>
          <tr>
            <th>서비스</th>
            <th>요금제</th>
            <th>사용기한</th>
            <th>공급가액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">${service.serviceName}</td>
            <td>${selectedOption?.name || '기본'}
              ${selectedOption?.description ? `<div class="service-description">${selectedOption.description}</div>` : ''}
            </td>
            <td>1개월</td>
            <td class="text-right">${servicePrice > 0 ? servicePrice.toLocaleString('ko-KR') + '원' : '문의'}</td>
          </tr>
          <tr class="total-row">
            <td colspan="3" class="text-right">최종 견적 금액 (VAT 미포함)</td>
            <td class="text-right">${servicePrice > 0 ? servicePrice.toLocaleString('ko-KR') + '원' : '문의'}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 비고 -->
    <div class="remarks-section">
      <div class="remarks-title">비고</div>
      <ol class="remarks-list">
        <li>본 견적의 유효기간은 제출일로부터 30일 입니다.</li>
        <li>${service.serviceName}은(는) ${service.companyName}에서 제공하는 서비스입니다.</li>
        ${quoteFormData.requirements ? `<li>고객 요청사항: ${quoteFormData.requirements}</li>` : ''}
      </ol>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * HTML을 PDF로 변환하여 다운로드
 */
export const downloadQuoteAsPDF = (htmlContent, fileName) => {
  // 새 창에서 열기
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  
  // 인쇄 다이얼로그 열기 (PDF로 저장 가능)
  setTimeout(() => {
    printWindow.print();
  }, 250);
};

/**
 * 견적서 데이터를 CSV 형식으로 변환하여 Excel 다운로드
 */
export const downloadQuoteAsExcel = (service, selectedOption, quoteFormData) => {
  const currentDate = new Date().toLocaleDateString('ko-KR');
  
  // 쉼표 제거 후 숫자 변환
  const parsePrice = (price) => {
    if (!price) return 0;
    const cleanPrice = String(price).replace(/,/g, '');
    return Number(cleanPrice) || 0;
  };
  
  const servicePrice = parsePrice(selectedOption?.price) || parsePrice(service.price) || 0;

  // CSV 데이터 생성 (Excel에서 열기 위해 UTF-8 BOM 추가)
  const csvContent = [
    [`${service.serviceName} 서비스 견적서`],
    [],
    [`작성일: ${currentDate}`],
    [`수신: ${quoteFormData.companyName || 'LookPick'} 귀하`],
    [],
    ['공급자 정보'],
    ['사업자번호', service.businessNumber || '-'],
    ['상호', service.companyName || '-'],
    ['대표', service.representative || '-'],
    ['주소', service.companyAddress || '-'],
    ['연락처', service.contactPhone || '-'],
    [],
    ['견적 명세'],
    ['서비스', '요금제', '사용기한', '공급가액'],
    [
      service.serviceName,
      selectedOption?.name || '기본',
      '1개월',
      servicePrice > 0 ? `${servicePrice.toLocaleString()}원` : '문의'
    ],
    [],
    ['', '', '최종 견적 금액 (VAT 미포함)', servicePrice > 0 ? `${servicePrice.toLocaleString()}원` : '문의'],
    [],
    ['비고'],
    ['1. 본 견적의 유효기간은 제출일로부터 30일 입니다.'],
    [`2. ${service.serviceName}은(는) ${service.companyName}에서 제공하는 서비스입니다.`],
  ];

  if (quoteFormData.requirements) {
    csvContent.push([`3. 고객 요청사항: ${quoteFormData.requirements}`]);
  }

  // CSV 문자열 생성
  const csvString = csvContent
    .map(row => row.join(','))
    .join('\n');

  // UTF-8 BOM 추가 (Excel에서 한글 깨짐 방지)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8;' });
  
  // 다운로드
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${service.serviceName}_견적서_${new Date().getTime()}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * 견적 요청 제출 (Firebase에 저장)
 */
export const submitQuoteRequest = async (service, selectedOption, quoteFormData) => {
  // Firebase에 견적 요청 저장 로직
  // 추후 구현 예정
  return {
    success: true,
    message: '견적 요청이 성공적으로 제출되었습니다.'
  };
};

