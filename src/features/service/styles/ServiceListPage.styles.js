import styled from 'styled-components';

export const ServiceListContainer = styled.div`
  min-height: 100vh;
`;

export const Header = styled.div`
  background: white;
  color: #0f172a;
  padding: 40px 0;
  border-bottom: 1px solid #e2e8f0;
`;

export const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const HeaderTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 20px;
  letter-spacing: -0.025em;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const CategoryTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

export const CategoryTab = styled.button`
  background: ${props => props.active ? '#f0f9ff' : '#f8fafc'};
  color: ${props => props.active ? '#0ea5e9' : '#64748b'};
  border: 1px solid ${props => props.active ? '#0ea5e9' : '#e2e8f0'};
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f0f9ff;
    color: #0ea5e9;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85rem;
  }
`;

export const SearchSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
`;

export const SearchContainer = styled.div`
  position: relative;
  max-width: 500px;
  width: 100%;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px 16px 50px;
  border: 1px solid #d1d5db;
  border-radius: 25px;
  font-size: 1rem;
  background: white;
  color: #374151;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    padding: 14px 18px 14px 45px;
    font-size: 0.9rem;
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 1.2rem;
  pointer-events: none;

  @media (max-width: 768px) {
    left: 16px;
    font-size: 1.1rem;
  }
`;

export const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
  display: grid;
  grid-template-columns: 280px 1px 1fr;
  gap: 0;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  @media (max-width: 768px) {
    padding: 20px 16px;
    gap: 20px;
  }
`;

export const Divider = styled.div`
  background: #e2e8f0;
  height: 100vh;
  min-height: 100vh;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const Sidebar = styled.div`
  background: white;
  padding: 24px;
  height: fit-content;
  position: sticky;
  top: 30px;

  @media (max-width: 1024px) {
    position: static;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const SidebarTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 20px;
`;

export const SubcategorySection = styled.div`
  margin-bottom: 32px;
`;

export const SubcategoryTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

export const SubcategoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SubcategoryItem = styled.button`
  background: ${props => props.active ? '#f0f9ff' : 'transparent'};
  color: ${props => props.active ? '#0ea5e9' : '#6b7280'};
  border: 1px solid ${props => props.active ? '#0ea5e9' : 'transparent'};
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
    color: #374151;
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
`;

export const FilterSection = styled.div`
  margin-bottom: 24px;
`;

export const FilterTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
`;

export const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

export const FilterSelect = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 0.85rem;
  }
`;

export const ServiceContent = styled.div`
  background: white;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  overflow: visible;

  @media (max-width: 1024px) {
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const LoadMoreButton = styled.button`
  background: white;
  color: #374151;
  border: 2px solid #d1d5db;
  padding: 16px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 auto;
  display: block;

  &:hover {
    border-color: #667eea;
    color: #667eea;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 1.1rem;
  color: #6b7280;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: #374151;
  }

  p {
    font-size: 1rem;
    margin-bottom: 0;
  }
`;

