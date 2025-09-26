import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import { GlobalStyle } from './styles/GlobalStyle';
import { theme } from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout/Layout';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ServiceRegisterPage from './pages/ServiceRegisterPage';
import ServiceEditPage from './pages/ServiceEditPage';
import AuthResultPage from './pages/AuthResultPage';
import MokStdRequest from './mok_react_index';
import MokStdRedirect from './mok_react_redirect';
import MokTestPage from './pages/MokTestPage';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <GlobalStyle />
          <Layout>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/category/:categoryId" element={<CategoryDetailPage />} />
              <Route path="/service-register" element={<ServiceRegisterPage />} />
              <Route path="/service-edit/:serviceId" element={<ServiceEditPage />} />
              <Route path="/auth-result" element={<AuthResultPage />} />
              <Route path="/mok" element={<MokStdRequest />} />
              <Route path="/mok/redirect" element={<MokStdRedirect />} />
              <Route path="/redirect" element={<MokStdRedirect />} />
              <Route path="/mok-test" element={<MokTestPage />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
