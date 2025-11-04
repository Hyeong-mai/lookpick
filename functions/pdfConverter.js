const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const { fromBuffer } = require('pdf-poppler');

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
exports.convertPdfToImagesV2 = functions.https.onRequest(async (req, res) => {
  // CORS 설정
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { pdfUrl, postId, userId } = req.body;
    
    if (!pdfUrl || !postId || !userId) {
      res.status(400).json({ error: '필수 매개변수가 누락되었습니다.' });
      return;
    }

    // PDF 파일 다운로드
    const pdfResponse = await axios({
      method: 'GET',
      url: pdfUrl,
      responseType: 'arraybuffer',
      timeout: 30000, // 30초 타임아웃
    });

    const pdfBuffer = Buffer.from(pdfResponse.data);

    // PDF를 이미지로 변환 (pdf-poppler 사용)
    const options = {
      format: 'jpeg',
      out_dir: '/tmp',
      out_prefix: 'page',
      page: null, // 모든 페이지
      quality: 80,
      density: 150,
      width: 800,
      height: 1200
    };

    const results = await fromBuffer(pdfBuffer, options);

    const images = [];

    // 변환된 이미지 파일들을 읽어서 버퍼로 변환
    for (let i = 0; i < results.length; i++) {
      try {
        const result = results[i];
        const imageBuffer = fs.readFileSync(result.path);
        
        // 파일 삭제 (임시 파일이므로)
        fs.unlinkSync(result.path);
        
        images.push({
          pageNum: i + 1,
          buffer: imageBuffer,
          width: result.width || 800,
          height: result.height || 1200,
        });
      } catch (pageError) {
        console.error(`페이지 ${i + 1} 변환 실패:`, pageError);
      }
    }

    // 변환된 이미지들을 Base64로 인코딩하여 클라이언트로 바로 전송
    const imageData = [];
    
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageBuffer = image.buffer;
      
      // 이미지 최적화 (Sharp 사용)
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(800, 1200, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Base64로 인코딩
      const base64Image = optimizedBuffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64Image}`;
      
      imageData.push({
        pageNumber: image.pageNum,
        dataUrl: dataUrl,
        width: image.width,
        height: image.height
      });
    }

    res.status(200).json({
      success: true,
      imageData: imageData,
      totalPages: images.length,
      conversionId: `${userId}_${postId}`
    });

  } catch (error) {
    console.error('PDF 변환 실패:', error);
    
    // 에러 상태를 Firestore에 저장
    if (req.body.postId && req.body.userId) {
      await admin.firestore()
        .collection('pdfConversions')
        .doc(`${req.body.userId}_${req.body.postId}`)
        .set({
          postId: req.body.postId,
          userId: req.body.userId,
          originalPdfUrl: req.body.pdfUrl,
          status: 'failed',
          error: error.message,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    res.status(500).json({ 
      error: `PDF 변환 중 오류가 발생했습니다: ${error.message}` 
    });
  }
});

/**
 * PDF 변환 상태 확인 함수
 * POST /checkPdfConversion
 * Body: { postId: string, userId: string }
 */
exports.checkPdfConversionV2 = functions.https.onRequest(async (req, res) => {
  // CORS 설정
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { postId, userId } = req.body;
    
    if (!postId || !userId) {
      res.status(400).json({ error: '필수 매개변수가 누락되었습니다.' });
      return;
    }

    const conversionDoc = await admin.firestore()
      .collection('pdfConversions')
      .doc(`${userId}_${postId}`)
      .get();

    if (!conversionDoc.exists) {
      res.status(200).json({
        success: false,
        status: 'not_found',
        message: '변환 요청을 찾을 수 없습니다.'
      });
      return;
    }

    const conversionData = conversionDoc.data();
    
    res.status(200).json({
      success: true,
      status: conversionData.status,
      imageUrls: conversionData.imageUrls || [],
      totalPages: conversionData.totalPages || 0,
      error: conversionData.error || null,
      createdAt: conversionData.createdAt
    });

  } catch (error) {
    console.error('PDF 변환 상태 확인 실패:', error);
    res.status(500).json({ 
      error: `상태 확인 중 오류가 발생했습니다: ${error.message}` 
    });
  }
});

/**
 * PDF 변환 결과 삭제 함수 (게시물 삭제 시 사용)
 * POST /deletePdfConversion
 * Body: { postId: string, userId: string }
 */
exports.deletePdfConversionV2 = functions.https.onRequest(async (req, res) => {
  // CORS 설정
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { postId, userId } = req.body;
    
    if (!postId || !userId) {
      res.status(400).json({ error: '필수 매개변수가 누락되었습니다.' });
      return;
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
      }

      // Firestore에서 변환 정보 삭제
      await conversionDoc.ref.delete();
    }

    res.status(200).json({
      success: true,
      message: 'PDF 변환 결과가 삭제되었습니다.'
    });

  } catch (error) {
    console.error('PDF 변환 삭제 실패:', error);
    res.status(500).json({ 
      error: `삭제 중 오류가 발생했습니다: ${error.message}` 
    });
  }
});
