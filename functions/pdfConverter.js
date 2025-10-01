const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const axios = require('axios');
const path = require('path');

// Firebase Admin 초기화 (이미 초기화되어 있다면 건너뛰기)
if (admin.apps.length === 0) {
  admin.initializeApp();
}

const storage = new Storage();
const bucket = storage.bucket('lookpick-d1f95.appspot.com');

/**
 * PDF를 이미지로 변환하는 Firebase Function
 * POST /convertPdfToImages
 * Body: { pdfUrl: string, postId: string, userId: string }
 */
exports.convertPdfToImages = functions.https.onCall(async (data, context) => {
  try {
    console.log('PDF 변환 요청 시작:', data);
    
    const { pdfUrl, postId, userId } = data;
    
    if (!pdfUrl || !postId || !userId) {
      throw new functions.https.HttpsError('invalid-argument', '필수 매개변수가 누락되었습니다.');
    }

    // PDF 파일 다운로드
    console.log('PDF 다운로드 시작:', pdfUrl);
    const pdfResponse = await axios({
      method: 'GET',
      url: pdfUrl,
      responseType: 'arraybuffer',
      timeout: 30000, // 30초 타임아웃
    });

    const pdfBuffer = Buffer.from(pdfResponse.data);
    console.log('PDF 다운로드 완료, 크기:', pdfBuffer.length);

    // PDF를 이미지로 변환 (pdf-poppler 사용)
    const pdf2pic = require('pdf2pic');
    
    const convertOptions = {
      density: 150,           // DPI
      saveFilename: "page",   // 저장할 파일명
      savePath: "/tmp",       // 임시 저장 경로
      format: "png",          // 출력 형식
      width: 800,             // 너비
      height: 1200            // 높이
    };

    const convert = pdf2pic.fromBuffer(pdfBuffer, convertOptions);
    const results = await convert.bulk(-1, { responseType: "base64" });

    console.log(`PDF 변환 완료, 총 ${results.length}페이지`);

    // 변환된 이미지들을 Firebase Storage에 업로드
    const imageUrls = [];
    
    for (let i = 0; i < results.length; i++) {
      const pageResult = results[i];
      const imageBuffer = Buffer.from(pageResult.base64, 'base64');
      
      // 이미지 최적화 (Sharp 사용)
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(800, 1200, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Firebase Storage에 업로드
      const fileName = `pdf-images/${userId}/${postId}/page_${i + 1}.jpg`;
      const file = bucket.file(fileName);
      
      await file.save(optimizedBuffer, {
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000', // 1년 캐시
        },
        public: true,
      });

      // 공개 URL 생성
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      imageUrls.push({
        pageNumber: i + 1,
        url: publicUrl,
        fileName: fileName
      });

      console.log(`페이지 ${i + 1} 업로드 완료:`, publicUrl);
    }

    // Firestore에 변환 결과 저장
    const conversionDoc = {
      postId: postId,
      userId: userId,
      originalPdfUrl: pdfUrl,
      imageUrls: imageUrls,
      totalPages: results.length,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'completed'
    };

    await admin.firestore()
      .collection('pdfConversions')
      .doc(`${userId}_${postId}`)
      .set(conversionDoc);

    console.log('PDF 변환 완료:', imageUrls.length, '페이지');

    return {
      success: true,
      imageUrls: imageUrls,
      totalPages: results.length,
      conversionId: `${userId}_${postId}`
    };

  } catch (error) {
    console.error('PDF 변환 실패:', error);
    
    // 에러 상태를 Firestore에 저장
    if (data.postId && data.userId) {
      await admin.firestore()
        .collection('pdfConversions')
        .doc(`${data.userId}_${data.postId}`)
        .set({
          postId: data.postId,
          userId: data.userId,
          originalPdfUrl: data.pdfUrl,
          status: 'failed',
          error: error.message,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    throw new functions.https.HttpsError('internal', `PDF 변환 중 오류가 발생했습니다: ${error.message}`);
  }
});

/**
 * PDF 변환 상태 확인 함수
 * POST /checkPdfConversion
 * Body: { postId: string, userId: string }
 */
exports.checkPdfConversion = functions.https.onCall(async (data, context) => {
  try {
    const { postId, userId } = data;
    
    if (!postId || !userId) {
      throw new functions.https.HttpsError('invalid-argument', '필수 매개변수가 누락되었습니다.');
    }

    const conversionDoc = await admin.firestore()
      .collection('pdfConversions')
      .doc(`${userId}_${postId}`)
      .get();

    if (!conversionDoc.exists) {
      return {
        success: false,
        status: 'not_found',
        message: '변환 요청을 찾을 수 없습니다.'
      };
    }

    const conversionData = conversionDoc.data();
    
    return {
      success: true,
      status: conversionData.status,
      imageUrls: conversionData.imageUrls || [],
      totalPages: conversionData.totalPages || 0,
      error: conversionData.error || null,
      createdAt: conversionData.createdAt
    };

  } catch (error) {
    console.error('PDF 변환 상태 확인 실패:', error);
    throw new functions.https.HttpsError('internal', `상태 확인 중 오류가 발생했습니다: ${error.message}`);
  }
});

/**
 * PDF 변환 결과 삭제 함수 (게시물 삭제 시 사용)
 * POST /deletePdfConversion
 * Body: { postId: string, userId: string }
 */
exports.deletePdfConversion = functions.https.onCall(async (data, context) => {
  try {
    const { postId, userId } = context.auth?.uid ? context.auth.uid : data.userId;
    
    if (!postId || !userId) {
      throw new functions.https.HttpsError('invalid-argument', '필수 매개변수가 누락되었습니다.');
    }

    // Firestore에서 변환 정보 조회
    const conversionDoc = await admin.firestore()
      .collection('pdfConversions')
      .doc(`${userId}_${postId}`)
      .get();

    if (conversionDoc.exists) {
      const conversionData = conversionDoc.data();
      
      // Firebase Storage에서 이미지 파일들 삭제
      if (conversionData.imageUrls && conversionData.imageUrls.length > 0) {
        const deletePromises = conversionData.imageUrls.map(imageUrl => {
          const fileName = imageUrl.fileName;
          return bucket.file(fileName).delete().catch(err => {
            console.warn(`파일 삭제 실패: ${fileName}`, err);
          });
        });
        
        await Promise.all(deletePromises);
        console.log(`PDF 변환 이미지 ${conversionData.imageUrls.length}개 삭제 완료`);
      }

      // Firestore에서 변환 정보 삭제
      await conversionDoc.ref.delete();
      console.log('PDF 변환 정보 삭제 완료');
    }

    return {
      success: true,
      message: 'PDF 변환 결과가 삭제되었습니다.'
    };

  } catch (error) {
    console.error('PDF 변환 삭제 실패:', error);
    throw new functions.https.HttpsError('internal', `삭제 중 오류가 발생했습니다: ${error.message}`);
  }
});
