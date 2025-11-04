import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet-async";
import { signUp } from "../core/firebase/auth";
import { uploadBusinessCertificate } from "../core/firebase/storage";
import {
  validateBusinessNumber,
  validateBusiness,
} from "../core/api/businessValidation";
import MokStdRequest from "../mok_react_index";

const SignupContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  // background-color: ${(props) => props.theme.colors.gray[50]};

  @media (max-width: 768px) {
    padding: 10px;
    align-items: flex-start;
    padding-top: 20px;
  }
`;

const SignupCard = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: ${(props) => props.theme.borderRadius.lg};
  box-shadow: ${(props) => props.theme.shadows.md};
  width: 100%;
  max-width: 800px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 20px;
    margin: 10px;
    border-radius: ${(props) => props.theme.borderRadius.md};
    width: calc(100% - 20px);
    max-width: calc(100vw - 20px);
  }
`;

const SignupTitle = styled.h1`
  text-align: center;
  margin-bottom: 10px;
  color: ${(props) => props.theme.colors.dark};
  font-size: 2rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 8px;
  }
`;

const SignupSubtitle = styled.p`
  text-align: center;
  margin-bottom: 40px;
  color: ${(props) => props.theme.colors.gray[600]};
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 30px;
  }
`;

const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const SectionTitle = styled.h3`
  color: ${(props) => props.theme.colors.dark};
  font-size: 1.2rem;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              ${(props) => props.theme.gradients.primary} border-box;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 12px;
    padding-bottom: 6px;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;

  label {
    display: block;
    margin: 8px 0px;
    font-weight: 600;
    color: ${(props) => props.theme.colors.dark};
    font-size: 0.9rem;
    word-wrap: break-word;
  }

  input,
  select {
    width: 100%;
    padding: 14px;
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    border-radius: ${(props) => props.theme.borderRadius.md};
    font-size: 16px;
    transition: all 0.3s ease;
    box-sizing: border-box;
    max-width: 100%;

    &:focus {
      border: 1px solid transparent;
      background: linear-gradient(white, white) padding-box,
                  ${(props) => props.theme.gradients.primary} border-box;
      outline: none;
      box-shadow: 0 0 0 3px rgba(115, 102, 255, 0.1);
    }

    &::placeholder {
      color: ${(props) => props.theme.colors.gray[400]};
    }

    @media (max-width: 768px) {
      padding: 12px;
      font-size: 16px; /* 모바일에서 줌 방지 */
    }
  }

  select {
    cursor: pointer;
  }
`;

const CustomSelectWrapper = styled.div`
  position: relative;
  width: 100%;
  box-sizing: border-box;
`;

const CustomSelectButton = styled.button`
  width: 100%;
  padding: 14px;
  padding-right: 45px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 16px;
  cursor: pointer;
  background-color: white;
  color: ${(props) => props.hasValue ? '#000000' : props.theme.colors.gray[400]};
  text-align: left;
  transition: all 0.2s ease;
  box-sizing: border-box;
  position: relative;

  &:hover {
    border-color: ${(props) => props.theme.colors.gray[400]};
  }

  &:focus {
    border: 1px solid transparent;
    background: linear-gradient(white, white) padding-box,
                ${(props) => props.theme.gradients.primary} border-box;
    outline: none;
    box-shadow: 0 0 0 3px rgba(115, 102, 255, 0.1);
  }

  &::after {
    content: "";
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%) rotate(${(props) => props.isOpen ? '-135deg' : '45deg'});
    width: 6px;
    height: 6px;
    border-right: 2px solid ${(props) => props.theme.colors.gray[500]};
    border-bottom: 2px solid ${(props) => props.theme.colors.gray[500]};
    transition: transform 0.2s ease;
  }

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 16px;
  }
`;

const CustomSelectDropdown = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: white;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  display: ${(props) => props.isOpen ? 'block' : 'none'};

  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const CustomSelectOption = styled.div`
  padding: 12px 14px;
  cursor: pointer;
  background-color: ${(props) => props.isSelected ? '#f0f0f0' : 'white'};
  color: #000000;
  font-size: 16px;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: #f8f8f8;
  }

  &:first-child {
    border-radius: ${(props) => props.theme.borderRadius.md} ${(props) => props.theme.borderRadius.md} 0 0;
  }

  &:last-child {
    border-radius: 0 0 ${(props) => props.theme.borderRadius.md} ${(props) => props.theme.borderRadius.md};
  }

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

const VerifyButton = styled.button`
  /* width: 100%; */
  padding: 14px 20px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(115, 102, 255, 0.3);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 0.85rem;
    min-width: 80px;
  }
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => props.theme.colors.dark || "#1F2937"};
  color: white;
  padding: 16px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1000;
  box-shadow: ${(props) => props.theme.shadows.lg};
  min-width: 320px;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${(props) => props.theme.colors.dark || "#1F2937"};
  }

  ${TooltipContainer}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  white-space: normal;
`;

const TooltipTitle = styled.div`
  font-weight: 600;
  font-size: 0.85rem;
  /* margin: 8px 0px; */
  color: white;
`;

const DocumentComparison = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const DocumentItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: ${(props) => props.theme.borderRadius.sm};
  background-color: ${(props) =>
    props.isCorrect ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"};
  border: 1px solid ${(props) => (props.isCorrect ? "#22C55E" : "#EF4444")};
`;

const DocumentIcon = styled.div`
  width: 40px;
  height: 50px;
  background-color: ${(props) => (props.isCorrect ? "#22C55E" : "#EF4444")};
  border-radius: ${(props) => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
`;

const DocumentLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  color: ${(props) => (props.isCorrect ? "#22C55E" : "#EF4444")};
`;

const StatusIcon = styled.div`
  font-size: 16px;
  color: ${(props) => (props.isCorrect ? "#22C55E" : "#EF4444")};
`;

const PhoneVerificationGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const PhoneInputGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: end;
  width: 100%;
  box-sizing: border-box;

  input {
    flex: 1;
    min-width: 0; /* flex 아이템이 줄어들 수 있도록 */
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
`;

const StatusMessage = styled.div`
  font-size: 0.8rem;
  margin-top: 5px;
  color: ${(props) =>
    props.isSuccess
      ? props.theme.colors.success || "#10B981"
      : props.theme.colors.danger || "#EF4444"};
`;

// 카카오 주소 검색 관련 스타일드 컴포넌트
const AddressSearchContainer = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
`;

const AddressInput = styled.input`
  flex: 1;
  width: 100%;
  padding: 12px;
  border: 1px solid ${(props) => props.theme.colors.gray[300]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 16px;
  transition: border-color 0.2s ease;
  background-color: ${(props) => props.theme.colors.gray[50]};
  color: ${(props) => props.theme.colors.gray[600]};
  cursor: not-allowed;
  box-sizing: border-box;
  max-width: 100%;
  min-width: 0;

  &:focus {
    border: 1px solid ${(props) => props.theme.colors.gray[300]};
    background-color: ${(props) => props.theme.colors.gray[50]};
    outline: none;
    box-shadow: none;
  }

  &::placeholder {
    color: ${(props) => props.theme.colors.gray[400]};
  }
`;

const AddressSearchButton = styled.button`
  padding: 12px 20px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-sizing: border-box;
  min-width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(115, 102, 255, 0.3);
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 12px;
  }
`;

const AddressPopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: none;
`;

const AddressPopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 500px;
  height: 80%;
  max-height: 600px;
  background: white;
  box-shadow: ${(props) => props.theme.shadows.xl};
  z-index: 10000;
  display: none;

  @media (max-width: 768px) {
    width: 95%;
    height: 85%;
    max-height: 500px;
  }
`;

const AddressPopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid ${(props) => props.theme.colors.gray[200]};

  @media (max-width: 768px) {
    padding: 15px;
  }
`;

const AddressPopupTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark};

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const AddressPopupCloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.gray[500]};
  padding: 5px;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.gray[100]};
    color: ${(props) => props.theme.colors.gray[700]};
  }

  @media (max-width: 768px) {
    font-size: 20px;
    padding: 8px;
  }
`;

const AddressPopupContent = styled.div`
  height: calc(100% - 80px);
  overflow: hidden;
`;

const SignupButton = styled.button`
  padding: 16px;
  background: ${(props) => props.theme.gradients.primary};
  color: white;
  border: none;
  border-radius: ${(props) => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(115, 102, 255, 0.3);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.gray[300]};
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 16px;
    margin-top: 15px;
  }
`;

const SignupFooter = styled.div`
  text-align: center;
  margin-top: 30px;

  @media (max-width: 768px) {
    margin-top: 20px;
  }

  a {
    background: ${(props) => props.theme.gradients.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const FileUploadGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FileUploadContainer = styled.div`
  display: flex;
  /* gap: 10px; */
  align-items: end;
`;

const FileInputWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const HiddenFileInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const FileInputDisplay = styled.div`
  width: 100%;
  padding: 10px;
  border: 2px dashed
    ${(props) =>
      props.hasFile
        ? 'transparent'
        : props.theme.colors.gray[300]};
  background: ${(props) =>
    props.hasFile
      ? `linear-gradient(white, white) padding-box, ${props.theme.gradients.primary} border-box`
      : 'transparent'};
  border-radius: ${(props) => props.theme.borderRadius.md};
  background-color: ${(props) =>
    props.disabled
      ? props.theme.colors.gray[100]
      : props.hasFile
      ? "rgba(59, 130, 246, 0.05)"
      : props.theme.colors.gray[50]};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  text-align: center;
  color: ${(props) =>
    props.disabled
      ? props.theme.colors.gray[400]
      : props.hasFile
      ? 'transparent'
      : props.theme.colors.gray[500]};
  background: ${(props) =>
    props.hasFile && !props.disabled
      ? props.theme.gradients.primary
      : 'transparent'};
  -webkit-background-clip: ${(props) => props.hasFile && !props.disabled ? 'text' : 'initial'};
  -webkit-text-fill-color: ${(props) => props.hasFile && !props.disabled ? 'transparent' : 'initial'};
  background-clip: ${(props) => props.hasFile && !props.disabled ? 'text' : 'initial'};
  opacity: ${(props) => (props.disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) =>
      props.disabled
        ? props.theme.colors.gray[300]
        : 'transparent'};
    background: ${(props) =>
      props.disabled
        ? props.theme.colors.gray[100]
        : `linear-gradient(white, white) padding-box, ${props.theme.gradients.primary} border-box`};
  }
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
`;

const LabelWithHelp = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0px;
`;

const LabelLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LabelRight = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  gap: 8px;
  color: ${(props) => props.theme.colors.gray[600]};
  cursor: pointer;
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
    cursor: pointer;
  }
`;

const LabelText = styled.label`
  line-height: 1.5;
  font-weight: 600;
  color: ${(props) => props.theme.colors.dark};
  font-size: 0.9rem;
`;

const HelpIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${(props) => props.theme.gradients.primary};

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${(props) => props.theme.colors.white};
  font-size: 0.9rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(115, 102, 255, 0.3);
  }
`;

const HelpTooltip = styled.div`
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${(props) => props.theme.colors.dark || "#1F2937"};
  color: white;
  padding: 12px 16px;
  border-radius: ${(props) => props.theme.borderRadius.md};
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 1001;
  box-shadow: ${(props) => props.theme.shadows.lg};
  min-width: 320px;

  white-space: normal;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${(props) => props.theme.colors.dark || "#1F2937"};
  }

  ${HelpIcon}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

const TermsSection = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 20px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    margin-top: 15px;
  }
`;

const TermsTitle = styled.h3`
  color: ${(props) => props.theme.colors.dark};
  font-size: 1.1rem;
  margin-bottom: 20px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-bottom: 12px;
  }
`;

const TermsItem = styled.div`
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
  width: 100%;
  box-sizing: border-box;
  flex-wrap: wrap;
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 6px;
  }
`;

const TermsLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: ${(props) => props.theme.colors.dark};
  flex: 1;
  word-wrap: break-word;
  
  .required {
    color: ${(props) => props.theme.colors.error};
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.85rem;
    gap: 6px;
  }
`;

const TermsToggleButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => props.theme.colors.primary};
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 28px;
  margin-top: 5px;
  white-space: nowrap;
  
  &:hover {
    color: ${(props) => props.theme.colors.primaryDark};
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-left: 24px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.8rem;
    margin-left: 20px;
    margin-top: 4px;
    white-space: normal;
  }
`;

const PasswordValidationBox = styled.div`
  margin-top: 10px;
  padding: 12px;
  background-color: ${(props) => props.theme.colors.gray[50]};
  border-radius: ${(props) => props.theme.borderRadius.md};
  border: 1px solid ${(props) => props.theme.colors.gray[200]};
  
  @media (max-width: 768px) {
    padding: 10px;
    margin-top: 8px;
  }
`;

const ValidationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: ${(props) => props.isValid ? '#10B981' : '#6B7280'};
  margin-bottom: 6px;
  transition: all 0.2s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
    gap: 6px;
    margin-bottom: 5px;
  }
`;

const ValidationIcon = styled.span`
  font-size: 1rem;
  font-weight: bold;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const SignupPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 커스텀 드롭다운 상태
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // 약관 동의 상태
  const [termsAgreement, setTermsAgreement] = useState({
    serviceTerms: false,
    privacyPolicy: false,
    thirdPartySharing: false,
    marketingConsent: false
  });

  // MOK 인증 모달 상태
  const [mokModal, setMokModal] = useState({
    isOpen: false,
    result: null
  });

  // 페이지 로드 시 localStorage에서 임시 저장된 폼 데이터 복구
  useEffect(() => {
    const savedFormData = localStorage.getItem('signupTempData');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        
        // base64 파일 데이터를 File 객체로 복구
        if (parsedData.businessCertificateData) {
          const { name, type, data } = parsedData.businessCertificateData;
          // base64를 Blob으로 변환
          fetch(data)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], name, { type });
              setFormData(prev => ({
                ...prev,
                ...parsedData,
                businessCertificate: file
              }));
            })
            .catch(err => {
              console.error('파일 복구 실패:', err);
              setFormData(prev => ({
                ...prev,
                ...parsedData,
                businessCertificate: null
              }));
            });
        } else {
          setFormData(prev => ({
            ...prev,
            ...parsedData
          }));
        }
        
        // 사업자 인증 결과도 복구
        if (parsedData.businessValidationResult) {
          setBusinessValidation({
            isVerifying: false,
            result: parsedData.businessValidationResult,
            error: null
          });
          setVerificationStatus(prev => ({
            ...prev,
            businessValidated: true
          }));
        }
        
        // 파일 업로드 상태 복구
        if (parsedData.attachLater) {
          setVerificationStatus(prev => ({
            ...prev,
            attachLater: true,
            fileUploaded: true
          }));
        } else if (parsedData.fileUploaded || parsedData.businessCertificateData) {
          setVerificationStatus(prev => ({
            ...prev,
            fileUploaded: true
          }));
        }
      } catch (error) {
        console.error('임시 저장 데이터 복구 실패:', error);
      }
    }
  }, []);

  // MOK 인증 데이터 처리
  useEffect(() => {
    const mokAuth = searchParams.get('mokAuth');
    if (mokAuth === 'true') {
      const userName = searchParams.get('userName');
      const userPhone = searchParams.get('userPhone');
      const userBirthday = searchParams.get('userBirthday');
      const userGender = searchParams.get('userGender');
      
      // localStorage에서 임시 저장된 데이터 가져오기
      const savedFormData = localStorage.getItem('signupTempData');
      let restoredData = {};
      if (savedFormData) {
        try {
          restoredData = JSON.parse(savedFormData);
        } catch (error) {
          console.error('임시 저장 데이터 복구 실패:', error);
        }
      }
      
      // base64 파일 데이터를 File 객체로 복구
      if (restoredData.businessCertificateData) {
        const { name, type, data } = restoredData.businessCertificateData;
        fetch(data)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], name, { type });
            setFormData(prev => ({
              ...prev,
              ...restoredData,
              businessCertificate: file,
              managerName: userName || restoredData.managerName || '',
              phoneNumber: userPhone || restoredData.phoneNumber || '',
            }));
          })
          .catch(err => {
            console.error('파일 복구 실패:', err);
            setFormData(prev => ({
              ...prev,
              ...restoredData,
              businessCertificate: null,
              managerName: userName || restoredData.managerName || '',
              phoneNumber: userPhone || restoredData.phoneNumber || '',
            }));
          });
      } else {
        // 폼 데이터 복구 + 본인인증 정보 추가
        setFormData(prev => ({
          ...prev,
          ...restoredData,
          managerName: userName || restoredData.managerName || '',
          phoneNumber: userPhone || restoredData.phoneNumber || '',
        }));
      }
      
      // 사업자 인증 결과 복구
      if (restoredData.businessValidationResult) {
        setBusinessValidation({
          isVerifying: false,
          result: restoredData.businessValidationResult,
          error: null
        });
      }
      
      // 파일 업로드 상태 복구
      if (restoredData.attachLater) {
        setVerificationStatus(prev => ({
          ...prev,
          attachLater: true,
          fileUploaded: true,
        }));
      } else if (restoredData.fileUploaded || restoredData.businessCertificateData) {
        setVerificationStatus(prev => ({
          ...prev,
          fileUploaded: true,
        }));
      }
      
      // 전화번호 인증 완료 표시
      setVerificationStatus(prev => ({
        ...prev,
        phoneVerified: true,
      }));
      
      // MOK 인증 결과 모달 표시
      setMokModal({
        isOpen: true,
        result: {
          userName,
          userPhone,
          userBirthday,
          userGender
        }
      });
      
      // localStorage 임시 데이터 삭제
      localStorage.removeItem('signupTempData');
      
      // URL 파라미터 제거
      navigate('/signup', { replace: true });
    }
  }, [searchParams, navigate]);
  
  const [formData, setFormData] = useState({
    // 기업 정보
    businessNumber: "",
    companyName: "",
    representative: "",
    companyAddress: "",
    establishmentDate: "",
    businessType: "",
    businessField: "",
    businessCertificate: null,

    // 담당자 정보
    managerName: "",
    phoneNumber: "",

    // 계정 정보
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [verificationStatus, setVerificationStatus] = useState({
    businessVerified: false,
    phoneVerified: false,
    fileUploaded: false,
    attachLater: false,
    businessValidated: false,
  });

  // 사업자진위확인 관련 상태 추가
  const [businessValidation, setBusinessValidation] = useState({
    isVerifying: false,
    result: null,
    error: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 비밀번호 유효성 검사 상태
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    special: false,
    match: false
  });

  // MOK 인증 모달 확인 핸들러
  // 약관 동의 핸들러
  const handleTermsChange = (termType) => {
    setTermsAgreement(prev => ({
      ...prev,
      [termType]: !prev[termType]
    }));
  };

  // 모든 필수 약관 동의 확인
  const isAllRequiredTermsAgreed = () => {
    return termsAgreement.serviceTerms && 
           termsAgreement.privacyPolicy && 
           termsAgreement.thirdPartySharing;
  };

  const handleMokModalConfirm = () => {
    if (mokModal.result) {
      // 폼 데이터에 MOK 인증 정보 자동 입력
      setFormData(prev => ({
        ...prev,
        managerName: mokModal.result.userName || '',
        phoneNumber: mokModal.result.userPhone || '',
      }));
      
      // 전화번호 인증 완료로 표시
      setVerificationStatus(prev => ({
        ...prev,
        phoneVerified: true,
      }));
    }
    
    // 모달 닫기
    setMokModal({
      isOpen: false,
      result: null
    });
  };

  // 커스텀 드롭다운 핸들러
  const handleCustomSelectToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleCustomSelectOption = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setOpenDropdown(null);
  };

  // 드롭다운 외부 클릭 시 닫기
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('[data-dropdown]')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // 카카오 주소 검색 스크립트 로드
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 주소 검색 함수
  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        width: '100%',
        height: '100%',
        maxSuggestItems: 5,
        showMoreHName: true,
        hideMapBtn: false,
        hideEngBtn: false,
        alwaysShowEngAddr: false,
        submitMode: false,
        useBanner: false,
        theme: {
          bgColor: '#FFFFFF',
          searchBgColor: '#F8F9FA',
          contentBgColor: '#FFFFFF',
          pageBgColor: '#FFFFFF',
          textColor: '#333333',
          queryTextColor: '#222222',
          postcodeTextColor: '#FA4256',
          emphTextColor: '#008BD3',
          outlineColor: '#E0E0E0'
        },
        oncomplete: function(data) {
          // 주소 정보를 조합
          let fullAddr = '';
          let extraAddr = '';

          // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져온다.
          if (data.userSelectedType === 'R') { // 사용자가 도로명 주소를 선택했을 경우
            fullAddr = data.roadAddress;
          } else { // 사용자가 지번 주소를 선택했을 경우(J)
            fullAddr = data.jibunAddress;
          }

          // 사용자가 선택한 주소가 도로명 타입일때 조합한다.
          if(data.userSelectedType === 'R'){
            //법정동명이 있을 경우 추가한다.
            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
              extraAddr += data.bname;
            }
            // 건물명이 있고, 공동주택일 경우 추가한다.
            if(data.buildingName !== '' && data.apartment === 'Y'){
              extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
            if(extraAddr !== ''){
              extraAddr = ' (' + extraAddr + ')';
            }
            // 조합된 참고항목을 해당 필드에 넣는다.
            fullAddr += extraAddr;
          }

          // 선택된 주소를 폼에 입력
          setFormData(prev => ({
            ...prev,
            companyAddress: fullAddr
          }));

          // 팝업 닫기
          handleCloseAddressPopup();
        }
      }).embed(document.getElementById('address-search-content'));
      
      // 팝업 표시
      document.getElementById('address-popup').style.display = 'block';
      document.getElementById('address-overlay').style.display = 'block';
    } else {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 팝업 닫기 함수
  const handleCloseAddressPopup = () => {
    document.getElementById('address-popup').style.display = 'none';
    document.getElementById('address-overlay').style.display = 'none';
  };

  // 사업자진위확인 API 호출 함수
  const handleBusinessValidation = async () => {
    if (!formData.businessNumber) {
      alert("사업자 등록번호를 입력해주세요.");
      return;
    }

    setBusinessValidation({
      isVerifying: true,
      result: null,
      error: null,
    });

    try {
      // Mock API 호출 (개발/테스트용)
      // 실제 환경에서는 validateBusiness 함수를 사용
      const data = await validateBusiness(formData.businessNumber);
      if (data.success) {
        // 국세청에 등록되지 않은 사업자등록번호 체크
        if (
          data.data &&
          data.data.taxType === "국세청에 등록되지 않은 사업자등록번호입니다."
        ) {
          setBusinessValidation({
            isVerifying: false,
            result: null,
            error: "국세청에 등록되지 않은 사업자등록번호입니다.",
          });
          return;
        }

        setBusinessValidation({
          isVerifying: false,
          result: data.data,
          error: null,
        });

        setVerificationStatus((prev) => ({
          ...prev,
          businessValidated: true,
        }));

        // API에서 받은 정보로 폼 데이터 자동 채우기 (선택사항)
        if (data.data.companyName && !formData.companyName) {
          setFormData((prev) => ({
            ...prev,
            companyName: data.data.companyName,
          }));
        }
      } else {
        setBusinessValidation({
          isVerifying: false,
          result: null,
          error: data.message || "사업자 정보를 확인할 수 없습니다.",
        });
      }
    } catch (error) {
      console.error("사업자진위확인 API 오류:", error);
      setBusinessValidation({
        isVerifying: false,
        result: null,
        error:
          "사업자진위확인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 사업자 등록번호가 변경되면 인증 결과 초기화
    if (name === "businessNumber") {
      setBusinessValidation({
        isVerifying: false,
        result: null,
        error: null,
      });
    }

    // 비밀번호 실시간 유효성 검사
    if (name === "password") {
      setPasswordValidation({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
        match: value === formData.confirmPassword && value.length > 0
      });
    }

    // 비밀번호 확인 실시간 검사
    if (name === "confirmPassword") {
      setPasswordValidation(prev => ({
        ...prev,
        match: value === formData.password && value.length > 0
      }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        businessCertificate: file,
      }));
      setVerificationStatus((prev) => ({ ...prev, fileUploaded: true }));
    }
  };

  const handleAttachLaterChange = (e) => {
    const isChecked = e.target.checked;
    setVerificationStatus((prev) => ({
      ...prev,
      attachLater: isChecked,
      fileUploaded: isChecked, // 나중에 첨부하기 체크 시 파일 업로드된 것으로 처리
    }));

    if (isChecked) {
      setFormData((prev) => ({
        ...prev,
        businessCertificate: null, // 파일 초기화
      }));
    }
  };

  // const handleBusinessVerification = () => {
  //   if (!formData.businessCertificate) {
  //     alert("사업자등록증명원을 먼저 첨부해주세요.");
  //     return;
  //   }
  //   // 사업자 등록번호 및 파일 검증 로직
  //   console.log("사업자 인증:", {
  //     businessNumber: formData.businessNumber,
  //     file: formData.businessCertificate,
  //   });
  //   setVerificationStatus((prev) => ({ ...prev, businessVerified: true }));
  // };

  // 본인인증 시작 전 데이터 저장
  const handleBeforeAuth = async () => {
    try {
      // 파일을 base64로 변환
      let fileData = null;
      if (formData.businessCertificate) {
        const reader = new FileReader();
        fileData = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve({
            name: formData.businessCertificate.name,
            size: formData.businessCertificate.size,
            type: formData.businessCertificate.type,
            data: e.target.result // base64 데이터
          });
          reader.onerror = reject;
          reader.readAsDataURL(formData.businessCertificate);
        });
      }

      // 현재 입력된 폼 데이터를 localStorage에 임시 저장
      const tempData = {
        ...formData,
        businessCertificate: null, // File 객체는 저장 불가
        businessCertificateData: fileData, // base64로 변환된 파일 데이터
        businessValidationResult: businessValidation.result,
        attachLater: verificationStatus.attachLater,
        fileUploaded: verificationStatus.fileUploaded,
      };
      localStorage.setItem('signupTempData', JSON.stringify(tempData));
      console.log('본인인증 전 데이터 저장 완료:', tempData);
    } catch (error) {
      console.error('데이터 저장 실패:', error);
      // 에러가 발생해도 나머지 데이터는 저장
      const tempData = {
        ...formData,
        businessCertificate: null,
        businessValidationResult: businessValidation.result,
        attachLater: verificationStatus.attachLater,
      };
      localStorage.setItem('signupTempData', JSON.stringify(tempData));
    }
  };

  // 휴대폰 본인인증 성공 콜백
  const handleAuthSuccess = (authData) => {
    // 인증된 정보로 폼 데이터 자동 채우기
    if (authData && authData.name) {
      setFormData((prev) => ({
        ...prev,
        managerName: authData.name,
      }));
    }
    
    // 휴대폰 번호도 인증된 번호로 설정 (인증 과정에서 사용된 번호)
    if (formData.phoneNumber) {
      setFormData((prev) => ({
        ...prev,
        phoneNumber: formData.phoneNumber, // 이미 입력된 번호 유지
      }));
    }
    
    setVerificationStatus((prev) => ({
      ...prev,
      phoneVerified: true,
    }));
    
    alert("본인인증이 완료되었습니다.");
  };

  // 휴대폰 본인인증 실패 콜백
  const handleAuthError = (error) => {
    console.error("본인인증 실패:", error);
    alert("본인인증에 실패했습니다. 다시 시도해주세요.");
  };

  // 인증번호 확인 함수 제거 (더 이상 사용하지 않음)

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 사업자 인증 완료 여부 검증
    if (!businessValidation.result) {
      alert("사업자 인증을 먼저 완료해주세요.");
      return;
    }

    // 휴대폰 본인인증 완료 여부 검증
    if (!verificationStatus.phoneVerified) {
      alert("휴대폰 본인인증을 먼저 완료해주세요.");
      return;
    }

    // 비밀번호 확인 검증
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    // 비밀번호 강도 검증
    if (formData.password.length < 8) {
      alert("비밀번호는 최소 8자 이상이어야 합니다.");
      return;
    }

    // 대문자 포함 확인
    if (!/[A-Z]/.test(formData.password)) {
      alert("비밀번호에 대문자가 최소 1개 이상 포함되어야 합니다.");
      return;
    }

    // 소문자 포함 확인
    if (!/[a-z]/.test(formData.password)) {
      alert("비밀번호에 소문자가 최소 1개 이상 포함되어야 합니다.");
      return;
    }

    // 특수문자 포함 확인
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      alert("비밀번호에 특수문자가 최소 1개 이상 포함되어야 합니다.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 사업자등록증 파일 업로드 (나중에 첨부하기가 아닌 경우)
      let businessCertificateUrl = null;
      if (formData.businessCertificate && !verificationStatus.attachLater) {
        const uploadResult = await uploadBusinessCertificate(
          formData.businessCertificate,
          `temp_${Date.now()}` // 임시 사용자 ID
        );
        businessCertificateUrl = uploadResult.url;
      }

      // Firebase 회원가입을 위한 사용자 정보 구성
      const userInfo = {
        name: formData.managerName,
        email: formData.email,
        phone: formData.phoneNumber,
        companyName: formData.companyName,
        businessNumber: formData.businessNumber,
        representative: formData.representative,
        companyAddress: formData.companyAddress,
        establishmentDate: formData.establishmentDate,
        businessType: formData.businessType,
        businessField: formData.businessField,
        managerName: formData.managerName,
        // 사업자등록증 관련 필드 (ProfileSection과 호환)
        businessRegistration: businessCertificateUrl, // ProfileSection에서 사용
        businessCertificateUrl: businessCertificateUrl, // 기존 호환성 유지
        // 인증 상태 설정
        verificationStatus: verificationStatus.attachLater 
          ? 'not_submitted'  // 나중에 첨부 선택 시
          : (businessCertificateUrl ? 'pending' : 'not_submitted'), // 파일 첨부 시 승인 대기
        isDocumentPending: verificationStatus.attachLater,
        phoneVerified: verificationStatus.phoneVerified,
        businessValidated: !!businessValidation.result,
        businessValidationResult: businessValidation.result,
      };

      // Firebase 회원가입 실행
      await signUp(formData.email, formData.password, userInfo);

      alert("회원가입이 성공적으로 완료되었습니다!");

      // 로그인 페이지로 이동
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);

      // Firebase 에러 메시지 한국어 변환
      let errorMessage = "회원가입 중 오류가 발생했습니다.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "이미 사용 중인 이메일 주소입니다.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "비밀번호가 너무 약합니다. 더 강한 비밀번호를 사용해주세요.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "유효하지 않은 이메일 주소입니다.";
      } else if (error.code === "auth/operation-not-allowed") {
        errorMessage = "이메일/비밀번호 회원가입이 비활성화되어 있습니다.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <script src="https://cert.ez-iok.com/stdauth/ds_auth_ptb/asset/js/ptb_ezauth_proc.js"></script>
      </Helmet>

      <SignupContainer>
        <SignupCard>
          <SignupTitle>사업자 회원가입</SignupTitle>
          <SignupSubtitle>
            LookPick 파트너로 등록하여 다양한 혜택을 누려보세요
          </SignupSubtitle>

          <SignupForm onSubmit={handleSubmit}>
            {/* 기업 정보 섹션 */}
            <div>
              <SectionTitle>기업 정보</SectionTitle>

              <FormGroup>
                <label>사업자 등록번호 *</label>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "end" }}
                >
                  <input
                    type="text"
                    name="businessNumber"
                    placeholder="사업자 등록번호를 입력하세요 (예: 123-45-67890)"
                    value={formData.businessNumber}
                    onChange={handleInputChange}
                    required
                    style={{ flex: 1 }}
                  />
                  <VerifyButton
                    type="button"
                    onClick={handleBusinessValidation}
                    disabled={
                      businessValidation.isVerifying ||
                      !formData.businessNumber ||
                      !validateBusinessNumber(formData.businessNumber)
                    }
                    style={{ minWidth: "100px" }}
                  >
                    {businessValidation.isVerifying ? "인증 중..." : "인증하기"}
                  </VerifyButton>
                </div>

                {/* 인증 결과 표시 */}
                {businessValidation.isVerifying && (
                  <StatusMessage style={{ marginTop: "8px" }}>
                    사업자 정보를 확인하고 있습니다...
                  </StatusMessage>
                )}

                {businessValidation.result && (
                  <StatusMessage isSuccess={true} style={{ marginTop: "8px" }}>
                    사업자 인증이 완료되었습니다.
                  </StatusMessage>
                )}

                {businessValidation.error && (
                  <StatusMessage style={{ marginTop: "8px" }}>
                    {businessValidation.error}
                  </StatusMessage>
                )}
              </FormGroup>

              <FormGroup>
                <LabelWithHelp>
                  <LabelLeft>
                    <LabelText>기업 인증 (사업자등록증) *</LabelText>
                  </LabelLeft>
                  <LabelRight>
                    <HelpIcon>
                      ?
                      <HelpTooltip>
                        <TooltipContent>
                          <TooltipTitle> 서류 제출 안내</TooltipTitle>

                          <div
                            style={{
                              fontSize: "0.75rem",
                              lineHeight: "1.5",
                              color: "#FED7D7",
                              marginBottom: "8px",
                            }}
                          >
                            <strong>나중에 첨부하기 선택 시:</strong>
                            <br />
                            • 서비스 출시 후 제품/서비스 노출 제한
                            <br />
                            • 예약 접수 및 결제 기능 비활성화
                            <br />• 파트너 인증 배지 미표시
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              lineHeight: "1.5",
                              color: "#D1FAE5",
                            }}
                          >
                            <strong>서류 제출 완료 시:</strong>
                            <br />
                            • 모든 서비스 기능 이용 가능
                            <br />• 우선 노출 및 인증 배지 제공
                          </div>
                        </TooltipContent>
                      </HelpTooltip>
                    </HelpIcon>
                    <LabelText>나중에 첨부하기</LabelText>
                    <input
                      type="checkbox"
                      checked={verificationStatus.attachLater}
                      onChange={handleAttachLaterChange}
                    />
                  </LabelRight>
                </LabelWithHelp>
                <FileUploadGroup>
                  <FileUploadContainer>
                    <FileInputWrapper>
                      <HiddenFileInput
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        disabled={verificationStatus.attachLater}
                      />
                      <FileInputDisplay
                        hasFile={!!formData.businessCertificate}
                        disabled={verificationStatus.attachLater}
                      >
                        <FileInfo>
                          {verificationStatus.attachLater
                            ? "나중에 첨부 예정"
                            : formData.businessCertificate
                            ? formData.businessCertificate.name
                            : "사업자등록증을 선택하세요 (PDF, JPG, PNG)"}
                        </FileInfo>
                      </FileInputDisplay>
                    </FileInputWrapper>
                    <TooltipContainer>
                      <Tooltip>
                        <TooltipContent>
                          <TooltipTitle>📋 필요 서류 안내</TooltipTitle>
                          <DocumentComparison>
                            <DocumentItem isCorrect={true}>
                              <DocumentIcon isCorrect={true}>📄</DocumentIcon>
                              <DocumentLabel isCorrect={true}>
                                사업자등록증명원
                              </DocumentLabel>
                              <StatusIcon isCorrect={true}>✅ 필요</StatusIcon>
                            </DocumentItem>
                            <DocumentItem isCorrect={false}>
                              <DocumentIcon isCorrect={false}>📋</DocumentIcon>
                              <DocumentLabel isCorrect={false}>
                                사업자등록증
                              </DocumentLabel>
                              <StatusIcon isCorrect={false}>❌ 불가</StatusIcon>
                            </DocumentItem>
                          </DocumentComparison>
                          <div
                            style={{
                              fontSize: "0.7rem",
                              textAlign: "center",
                              marginTop: "4px",
                              color: "#D1D5DB",
                            }}
                          >
                            * 사업자등록증명원만 인증 가능합니다
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipContainer>
                  </FileUploadContainer>
                  {!verificationStatus.attachLater &&
                    verificationStatus.fileUploaded && (
                      <StatusMessage isSuccess={true}>
                        파일이 업로드되었습니다.
                      </StatusMessage>
                    )}
                  {verificationStatus.businessVerified && (
                    <StatusMessage isSuccess={true}>
                      기업인증이 완료되었습니다.
                    </StatusMessage>
                  )}
                </FileUploadGroup>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label>기업명 *</label>
                  <input
                    type="text"
                    name="companyName"
                    placeholder="기업명을 입력하세요"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>대표자명 *</label>
                  <input
                    type="text"
                    name="representative"
                    placeholder="대표자명을 입력하세요"
                    value={formData.representative}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label>회사주소 *</label>
                <AddressSearchContainer>
                  <AddressInput
                    type="text"
                    name="companyAddress"
                    placeholder="주소 검색 버튼을 클릭하여 주소를 선택하세요"
                    value={formData.companyAddress}
                    onChange={handleInputChange}
                    required
                    readOnly
                  />
                  <AddressSearchButton
                    type="button"
                    onClick={handleAddressSearch}
                  >
                    주소 검색
                  </AddressSearchButton>
                </AddressSearchContainer>
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label>기업 구분 *</label>
                  <CustomSelectWrapper data-dropdown>
                    <CustomSelectButton
                      type="button"
                      onClick={() => handleCustomSelectToggle('businessField')}
                      isOpen={openDropdown === 'businessField'}
                      hasValue={!!formData.businessField}
                    >
                      {formData.businessField 
                        ? {
                            large: '대기업',
                            medium: '중견기업',
                            small: '중소기업',
                            startup: '스타트업',
                            individual: '개인사업자'
                          }[formData.businessField]
                        : '기업 구분을 선택하세요'
                      }
                    </CustomSelectButton>
                    <CustomSelectDropdown isOpen={openDropdown === 'businessField'}>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessField', 'large')}
                        isSelected={formData.businessField === 'large'}
                      >
                        대기업
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessField', 'medium')}
                        isSelected={formData.businessField === 'medium'}
                      >
                        중견기업
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessField', 'small')}
                        isSelected={formData.businessField === 'small'}
                      >
                        중소기업
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessField', 'startup')}
                        isSelected={formData.businessField === 'startup'}
                      >
                        스타트업
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessField', 'individual')}
                        isSelected={formData.businessField === 'individual'}
                      >
                        개인사업자
                      </CustomSelectOption>
                    </CustomSelectDropdown>
                  </CustomSelectWrapper>
                </FormGroup>

                <FormGroup>
                  <label>기업 분야 *</label>
                  <CustomSelectWrapper data-dropdown>
                    <CustomSelectButton
                      type="button"
                      onClick={() => handleCustomSelectToggle('businessType')}
                      isOpen={openDropdown === 'businessType'}
                      hasValue={!!formData.businessType}
                    >
                      {formData.businessType 
                        ? {
                            software: '개발 / 소프트웨어 / IT',
                            design: '디자인 / 콘텐츠 / 마케팅',
                            logistics: '물류 / 운송 / 창고',
                            manufacturing: '제조 / 생산 / 가공',
                            infrastructure: '설비 / 건설 / 유지보수',
                            education: '교육 / 컨설팅 / 인증',
                            office: '사무 / 문서 / 번역',
                            advertising: '광고 / 프로모션 / 행사',
                            machinery: '기계 / 장비 / 산업재',
                            lifestyle: '생활 / 복지 / 기타 서비스'
                          }[formData.businessType]
                        : '기업 분야를 선택하세요'
                      }
                    </CustomSelectButton>
                    <CustomSelectDropdown isOpen={openDropdown === 'businessType'}>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'software')}
                        isSelected={formData.businessType === 'software'}
                      >
                        개발 / 소프트웨어 / IT
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'design')}
                        isSelected={formData.businessType === 'design'}
                      >
                        디자인 / 콘텐츠 / 마케팅
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'logistics')}
                        isSelected={formData.businessType === 'logistics'}
                      >
                        물류 / 운송 / 창고
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'manufacturing')}
                        isSelected={formData.businessType === 'manufacturing'}
                      >
                        제조 / 생산 / 가공
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'infrastructure')}
                        isSelected={formData.businessType === 'infrastructure'}
                      >
                        설비 / 건설 / 유지보수
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'education')}
                        isSelected={formData.businessType === 'education'}
                      >
                        교육 / 컨설팅 / 인증
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'office')}
                        isSelected={formData.businessType === 'office'}
                      >
                        사무 / 문서 / 번역
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'advertising')}
                        isSelected={formData.businessType === 'advertising'}
                      >
                        광고 / 프로모션 / 행사
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'machinery')}
                        isSelected={formData.businessType === 'machinery'}
                      >
                        기계 / 장비 / 산업재
                      </CustomSelectOption>
                      <CustomSelectOption
                        onClick={() => handleCustomSelectOption('businessType', 'lifestyle')}
                        isSelected={formData.businessType === 'lifestyle'}
                      >
                        생활 / 복지 / 기타 서비스
                      </CustomSelectOption>
                    </CustomSelectDropdown>
                  </CustomSelectWrapper>
                </FormGroup>
              </FormRow>

              {/* 사업자진위확인 섹션 삭제 */}
            </div>

            {/* 나머지 섹션들은 기존과 동일 */}
            {/* 담당자 정보 섹션 */}
            <div>
              <SectionTitle>담당자 정보</SectionTitle>

              <FormGroup>
                <label>담당자명 *</label>
                <input
                  type="text"
                  name="managerName"
                  placeholder="본인인증을 통해 자동으로 입력됩니다"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  required
                  disabled={true}
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#6B7280',
                    cursor: 'not-allowed'
                  }}
                />

              </FormGroup>

              <FormGroup>
                <label>전화번호 *</label>
                <PhoneVerificationGroup>
                  <PhoneInputGroup>
                    <input
                      type="tel"
                      name="phoneNumber"
                      placeholder="본인인증을 통해 자동으로 입력됩니다"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      required
                       disabled={true}
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#6B7280',
                        cursor: 'not-allowed'
                      }}
                    />
                    <MokStdRequest
                      onBeforeAuth={handleBeforeAuth}
                      onAuthSuccess={handleAuthSuccess}
                      onAuthError={handleAuthError}
                      isVerified={verificationStatus.phoneVerified}
                      disabled={verificationStatus.phoneVerified}
                      userId={formData.email}
                      email={formData.email}
                    />
                  </PhoneInputGroup>

                  {verificationStatus.phoneVerified && (
                    <StatusMessage isSuccess={true}>
                      ✅ 휴대폰 본인인증이 완료되었습니다.
                    </StatusMessage>
                  )}

                  {/* 본인인증 안내 메시지 */}
                  {!verificationStatus.phoneVerified && (
                    <div style={{ 
                      fontSize: "0.8rem", 
                      color: "#6B7280", 
                      marginTop: "5px",
                      padding: "8px 12px",
                      backgroundColor: "#F3F4F6",
                      borderRadius: "6px",
                      border: "1px solid #E5E7EB"
                    }}>
                      📱 본인인증 버튼을 클릭하여 인증을 진행해주세요.
                    </div>
                  )}
                 
                </PhoneVerificationGroup>
              </FormGroup>
            </div>

            {/* 계정 정보 섹션 */}
            <div>
              <SectionTitle>계정 정보</SectionTitle>

              <FormRow>
                <FormGroup>
                  <label>이메일 *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="이메일을 입력하세요"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <label>비밀번호 * (8자 이상, 대소문자+특수문자 포함)</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="비밀번호를 입력하세요"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  {formData.password && (
                    <PasswordValidationBox>
                      <ValidationItem isValid={passwordValidation.length}>
                        <ValidationIcon>{passwordValidation.length ? '✓' : '○'}</ValidationIcon>
                        <span>8자 이상</span>
                      </ValidationItem>
                      <ValidationItem isValid={passwordValidation.uppercase}>
                        <ValidationIcon>{passwordValidation.uppercase ? '✓' : '○'}</ValidationIcon>
                        <span>대문자 포함</span>
                      </ValidationItem>
                      <ValidationItem isValid={passwordValidation.lowercase}>
                        <ValidationIcon>{passwordValidation.lowercase ? '✓' : '○'}</ValidationIcon>
                        <span>소문자 포함</span>
                      </ValidationItem>
                      <ValidationItem isValid={passwordValidation.special}>
                        <ValidationIcon>{passwordValidation.special ? '✓' : '○'}</ValidationIcon>
                        <span>특수문자 포함</span>
                      </ValidationItem>
                    </PasswordValidationBox>
                  )}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label>비밀번호 확인 *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호를 다시 입력하세요"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                {formData.confirmPassword && (
                  <PasswordValidationBox>
                    <ValidationItem isValid={passwordValidation.match}>
                      <ValidationIcon>{passwordValidation.match ? '✓' : '○'}</ValidationIcon>
                      <span>비밀번호 일치</span>
                    </ValidationItem>
                  </PasswordValidationBox>
                )}
              </FormGroup>
            </div>

            {/* 약관 동의 섹션 */}
            <TermsSection>
              <TermsTitle>약관 동의</TermsTitle>
              
              {/* 서비스 이용약관 동의 */}
              <TermsItem>
                <TermsCheckbox>
                  <input
                    type="checkbox"
                    id="serviceTerms"
                    checked={termsAgreement.serviceTerms}
                    onChange={() => handleTermsChange('serviceTerms')}
                  />
                  <TermsLabel htmlFor="serviceTerms">
                    <span className="required">(필수)</span> 서비스 이용약관 동의
                  </TermsLabel>
                </TermsCheckbox>
                <TermsToggleButton
                  type="button"
                  onClick={() => navigate('/terms')}
                >
                  약관 내용 보기
                </TermsToggleButton>
              </TermsItem>

              {/* 개인정보 수집 및 이용 동의 */}
              <TermsItem>
                <TermsCheckbox>
                  <input
                    type="checkbox"
                    id="privacyPolicy"
                    checked={termsAgreement.privacyPolicy}
                    onChange={() => handleTermsChange('privacyPolicy')}
                  />
                  <TermsLabel htmlFor="privacyPolicy">
                    <span className="required">(필수)</span> 개인정보 수집 및 이용에 대한 동의
                  </TermsLabel>
                </TermsCheckbox>
                <TermsToggleButton
                  type="button"
                  onClick={() => navigate('/privacy')}
                >
                  약관 내용 보기
                </TermsToggleButton>
              </TermsItem>

              {/* 개인정보 제3자 제공 동의 */}
              <TermsItem>
                <TermsCheckbox>
                  <input
                    type="checkbox"
                    id="thirdPartySharing"
                    checked={termsAgreement.thirdPartySharing}
                    onChange={() => handleTermsChange('thirdPartySharing')}
                  />
                  <TermsLabel htmlFor="thirdPartySharing">
                    <span className="required">(필수)</span> 개인정보 제3자 제공에 대한 동의
                  </TermsLabel>
                </TermsCheckbox>
                <TermsToggleButton
                  type="button"
                  onClick={() => navigate('/privacy')}
                >
                  약관 내용 보기
                </TermsToggleButton>
              </TermsItem>

              {/* 마케팅 정보 수신 동의 */}
              <TermsItem>
                <TermsCheckbox>
                  <input
                    type="checkbox"
                    id="marketingConsent"
                    checked={termsAgreement.marketingConsent}
                    onChange={() => handleTermsChange('marketingConsent')}
                  />
                  <TermsLabel htmlFor="marketingConsent">
                    (선택) 마케팅 정보 수신 동의
                  </TermsLabel>
                </TermsCheckbox>
                <TermsToggleButton
                  type="button"
                  onClick={() => navigate('/privacy')}
                >
                  약관 내용 보기
                </TermsToggleButton>
              </TermsItem>
            </TermsSection>

            <SignupButton
              type="submit"
              disabled={
                isSubmitting ||
                !formData.businessNumber ||
                !formData.companyName ||
                !formData.representative ||
                !formData.companyAddress ||
                !formData.businessField ||
                !formData.businessType ||
                !formData.managerName ||
                !verificationStatus.phoneVerified ||
                !businessValidation.result || // 사업자 인증 완료 조건 추가
                !formData.email ||
                !formData.password ||
                !formData.confirmPassword ||
                (!verificationStatus.fileUploaded &&
                  !verificationStatus.attachLater) ||
                !isAllRequiredTermsAgreed() // 필수 약관 동의 확인
              }
            >
              {isSubmitting
                ? "회원가입 처리 중..."
                : !businessValidation.result
                ? "사업자 인증을 먼저 완료해주세요"
                : "사업자 회원가입"}
            </SignupButton>

            {/* 사업자 인증 필수 안내 메시지 */}
            {!businessValidation.result && (
              <StatusMessage style={{ marginTop: "10px", textAlign: "center" }}>
                회원가입을 위해서는 사업자 인증이 필요합니다.
              </StatusMessage>
            )}
          </SignupForm>

          <SignupFooter>
            <p>
              이미 계정이 있으신가요? <Link to="/login">로그인</Link>
            </p>
          </SignupFooter>
        </SignupCard>

        {/* 주소 검색 팝업 */}
        <AddressPopupOverlay id="address-overlay" onClick={handleCloseAddressPopup} />
        <AddressPopupContainer id="address-popup">
          <AddressPopupHeader>
            <AddressPopupTitle>주소 검색</AddressPopupTitle>
            <AddressPopupCloseButton onClick={handleCloseAddressPopup}>
              ✕
            </AddressPopupCloseButton>
          </AddressPopupHeader>
          <AddressPopupContent>
            <div id="address-search-content" style={{ width: '100%', height: '100%' }}></div>
          </AddressPopupContent>
        </AddressPopupContainer>

        {/* MOK 인증 결과 모달 */}
        {mokModal.isOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}>
              <h2 style={{ marginBottom: '20px', color: '#333' }}>본인인증 완료</h2>
              {mokModal.result && (
                <div style={{ marginBottom: '20px' }}>
                  <p><strong>이름:</strong> {mokModal.result.userName}</p>
                  <p><strong>전화번호:</strong> {mokModal.result.userPhone}</p>
                  <p><strong>생년월일:</strong> {mokModal.result.userBirthday}</p>
                  <p><strong>성별:</strong> {mokModal.result.userGender === '1' ? '남자' : '여자'}</p>
                </div>
              )}
              <button
                onClick={handleMokModalConfirm}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                확인
              </button>
            </div>
          </div>
        )}
      </SignupContainer>
    </>
  );
};

export default SignupPage;
