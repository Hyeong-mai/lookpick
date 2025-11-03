import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { HelmetProvider } from 'react-helmet-async';
import { GlobalStyle } from './shared/styles/GlobalStyle';
import { theme } from './shared/styles/theme';
import { AuthProvider } from './core/contexts/AuthContext';
import Layout from './shared/components/layout/Layout';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage';
import AdminPage from './pages/AdminPage';
import CategoryDetailPage from './pages/CategoryDetailPage';
import ServiceRegisterPage from './pages/ServiceRegisterPage';
import ServiceEditPage from './pages/ServiceEditPage';
import ServiceListPage from './pages/ServiceListPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import AuthResultPage from './pages/AuthResultPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import MokStdRequest from './mok_react_index';
import MokStdRedirect from './mok_react_redirect';

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
              <Route path="/services" element={<ServiceListPage />} />
              <Route path="/service/:serviceId" element={<ServiceDetailPage />} />
              <Route path="/auth-result" element={<AuthResultPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/mok" element={<MokStdRequest />} />
              <Route path="/mok/redirect" element={<MokStdRedirect />} />
              <Route path="/redirect" element={<MokStdRedirect />} />
            </Routes>
          </Layout>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
