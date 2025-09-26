#!/bin/bash

echo "🚀 LookPick 배포 시작..."

# 1. React 앱 빌드
echo "📦 React 앱 빌드 중..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ React 빌드 실패"
    exit 1
fi

# 2. Firebase Functions 배포
echo "🔧 Firebase Functions 배포 중..."
cd functions
npm install
firebase deploy --only functions

if [ $? -ne 0 ]; then
    echo "❌ Functions 배포 실패"
    exit 1
fi

# 3. Firebase Hosting 배포
echo "🌐 Firebase Hosting 배포 중..."
cd ..
firebase deploy --only hosting

if [ $? -ne 0 ]; then
    echo "❌ Hosting 배포 실패"
    exit 1
fi

echo "✅ 배포 완료!"
echo "🌐 웹사이트: https://www.lookpick.co.kr"
echo "🔧 Functions: https://us-central1-lookpick-d1f95.cloudfunctions.net/mokApi"
