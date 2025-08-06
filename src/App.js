import React from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "./styles/GlobalStyle";
import { theme } from "./styles/theme";

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";
import CategoryDetailPage from "./pages/CategoryDetailPage";
import ServiceRegisterPage from "./pages/ServiceRegisterPage";
import ServiceEditPage from "./pages/ServiceEditPage";
import AdminPage from "./pages/AdminPage";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/category/:id" element={<CategoryDetailPage />} />
          <Route path="/service-register" element={<ServiceRegisterPage />} />
          <Route
            path="/service-edit/:serviceId"
            element={<ServiceEditPage />}
          />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Layout>
    </ThemeProvider>
  );
}

export default App;
