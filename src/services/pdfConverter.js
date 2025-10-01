// Firebase Functions URL
const FUNCTIONS_URL = 'https://us-central1-lookpick-d1f95.cloudfunctions.net';

// HTTP 요청 헬퍼 함수
const makeRequest = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * PDF를 이미지로 변환하고 결과를 반환하는 함수
 * @param {string} pdfUrl - PDF 파일 URL
 * @param {string} postId - 게시물 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 변환 결과
 */
export const convertPdfToImagesService = async (pdfUrl, postId, userId) => {
  try {
    console.log('PDF 변환 요청:', { pdfUrl, postId, userId });
    
    const result = await makeRequest(`${FUNCTIONS_URL}/convertPdfToImagesV2`, {
      pdfUrl,
      postId,
      userId
    });

    console.log('PDF 변환 성공:', result);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('PDF 변환 실패:', error);
    return {
      success: false,
      error: error.message || 'PDF 변환 중 오류가 발생했습니다.'
    };
  }
};

/**
 * PDF 변환 상태를 확인하는 함수
 * @param {string} postId - 게시물 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 변환 상태
 */
export const checkPdfConversionService = async (postId, userId) => {
  try {
    console.log('PDF 변환 상태 확인:', { postId, userId });
    
    const result = await makeRequest(`${FUNCTIONS_URL}/checkPdfConversionV2`, {
      postId,
      userId
    });

    console.log('PDF 변환 상태:', result);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('PDF 변환 상태 확인 실패:', error);
    return {
      success: false,
      error: error.message || 'PDF 변환 상태 확인 중 오류가 발생했습니다.'
    };
  }
};

/**
 * PDF 변환 결과를 삭제하는 함수
 * @param {string} postId - 게시물 ID
 * @param {string} userId - 사용자 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deletePdfConversionService = async (postId, userId) => {
  try {
    console.log('PDF 변환 결과 삭제:', { postId, userId });
    
    const result = await makeRequest(`${FUNCTIONS_URL}/deletePdfConversionV2`, {
      postId,
      userId
    });

    console.log('PDF 변환 결과 삭제 성공:', result);
    return {
      success: true,
      data: result
    };
  } catch (error) {
    console.error('PDF 변환 결과 삭제 실패:', error);
    return {
      success: false,
      error: error.message || 'PDF 변환 결과 삭제 중 오류가 발생했습니다.'
    };
  }
};
