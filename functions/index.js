const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// MOK 서버 로직을 가져옴
const mokServer = require('./mok_react_server');

// PDF 변환 함수들을 가져옴
const pdfConverter = require('./pdfConverter');

// Express 앱 생성
const app = express();

// CORS 설정
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://lookpick-d1f95.web.app',
    'https://www.lookpick.co.kr',
    'https://lookpick.co.kr'
  ],
  credentials: true
}));

// Body parser 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MOK 서버의 모든 라우트를 Express 앱에 연결
app.use('/', mokServer);

// Firebase Functions로 배포
exports.mokApi = functions.https.onRequest(app);

// PDF 변환 함수들 export
exports.convertPdfToImages = pdfConverter.convertPdfToImages;
exports.checkPdfConversion = pdfConverter.checkPdfConversion;
exports.deletePdfConversion = pdfConverter.deletePdfConversion;
