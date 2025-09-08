import React from 'react';
import { Routes, BrowserRouter as Router, Route } from 'react-router-dom';
import MokStdRequest from './mok_react_index';
import MokStdRedirect from './mok_react_redirect';

// Mobile-OK 공식 가이드에 따른 간단한 테스트 앱
function MokTestApp() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<MokStdRequest />} />
        <Route exact path="/redirect" element={<MokStdRedirect />} />
      </Routes>
    </Router>
  );
}

export default MokTestApp;

