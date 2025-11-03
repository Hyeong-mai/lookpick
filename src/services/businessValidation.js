/**
 * 사업자진위확인 API 서비스
 * 공공데이터포털의 사업자등록정보 진위확인 API를 사용
 */

// 환경 변수에서 API 키 가져오기 (실제 키로 대체 가능)

//   "7HzFVvBPsMtKLbU2IoFXq1Rn%2FWGUSLmLKUig8fN1O0HcVwWUPzxiXfjzMvqNIF9pX%2F6TI6BnY6%2BuTDHr%2Br1QcQ%3D%3D";
const DECODING_KEY =
  process.env.REACT_APP_BUSINESS_API_DECODING_KEY ||
  "7HzFVvBPsMtKLbU2IoFXq1Rn/WGUSLmLKUig8fN1O0HcVwWUPzxiXfjzMvqNIF9pX/6TI6BnY6+uTDHr+r1QcQ==";
const API_URL =
  process.env.REACT_APP_BUSINESS_API_URL ||
  "https://api.odcloud.kr/api/nts-businessman/v1";

/**
 * 사업자등록번호 형식 검증
 * @param {string} businessNumber - 사업자등록번호
 * @returns {boolean} 유효성 여부
 */
export const validateBusinessNumber = (businessNumber) => {
  if (!businessNumber) return false;

  // 숫자만 추출
  const numbers = businessNumber.replace(/[^0-9]/g, "");

  // 10자리 체크
  if (numbers.length !== 10) return false;

  return true;
};

/**
 * 사업자진위확인 API 호출
 * @param {string} businessNumber - 사업자등록번호 (10자리)
 * @param {string} representative - 대표자명
 * @param {string} establishmentDate - 개업일자 (YYYY-MM-DD)
 * @returns {Promise<Object>} 검증 결과
 */
export const validateBusiness = async (businessNumber) => {
  try {
    // 공공데이터포털 API 스펙에 맞는 요청 형식
    const url = `${API_URL}/status?serviceKey=${encodeURIComponent(
      DECODING_KEY
    )}`;

    // 사업자등록번호에서 숫자만 추출
    const cleanBusinessNumber = businessNumber.replace(/[^0-9]/g, "");

    // 공공데이터포털 API 스펙에 맞는 요청 데이터 형식
    const requestData = {
      b_no: [cleanBusinessNumber], // 사업자등록번호
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // API 응답 구조에 맞게 결과 처리
    if (data && data.data && data.data.length > 0) {
      const businessInfo = data.data[0];

      return {
        success: true,
        data: {
          businessNumber: businessInfo.b_no,
          companyName: businessInfo.b_nm,
          representative: businessInfo.p_nm,
          establishmentDate: businessInfo.start_dt,
          status: businessInfo.b_stt,
          statusMessage: businessInfo.b_stt_cd,
          taxType: businessInfo.tax_type,
          taxTypeCode: businessInfo.tax_type_cd,
          businessType: businessInfo.utcc_yn,
          businessAddress: businessInfo.b_adr,
          validated: businessInfo.valid === "01", // "01"이면 유효
        },
        message: "사업자 정보가 확인되었습니다.",
      };
    } else {
      return {
        success: false,
        data: null,
        message: "사업자 정보를 확인할 수 없습니다.",
      };
    }
  } catch (error) {
    console.error("사업자진위확인 API 오류:", error);

    // 더 구체적인 오류 메시지 제공
    let errorMessage = "사업자진위확인 중 오류가 발생했습니다.";

    if (error.message.includes("400")) {
      errorMessage = "잘못된 요청입니다. 입력 정보를 확인해주세요.";
    } else if (error.message.includes("401")) {
      errorMessage = "API 인증에 실패했습니다.";
    } else if (error.message.includes("403")) {
      errorMessage = "API 접근 권한이 없습니다.";
    } else if (error.message.includes("500")) {
      errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }

    throw new Error(errorMessage);
  }
};
