import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const HeaderContainer = styled.header`
  background-color: ${({ isScrolled }) =>
    isScrolled ? "#ffffff" : "transparent"};
  box-shadow: ${({ isScrolled }) =>
    isScrolled ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none"};
`;
const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
`;
const Nav = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 800;
  text-decoration: none;
  color: ${({ isScrolled }) => (isScrolled ? "#333" : "#ffffff")};
  transition: color 0.3s ease;
  letter-spacing: -0.02em;
`;

const SearchContainer = styled.div`
  max-width: 600px;
  width: 90%;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.8rem 1.5rem;
  border: 2px solid
    ${({ isScrolled }) => (isScrolled ? "#e0e0e0" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 30px;
  background-color: ${({ isScrolled }) =>
    isScrolled ? "#ffffff" : "rgba(255, 255, 255, 0.1)"};
  color: ${({ isScrolled }) => (isScrolled ? "#333" : "#ffffff")};
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: ${({ isScrolled }) =>
      isScrolled ? "#999" : "rgba(255, 255, 255, 0.7)"};
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ isScrolled }) => (isScrolled ? "#333" : "#ffffff")};
  transition: color 0.3s ease;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ isScrolled }) =>
    isScrolled ? "#f8f9fa" : "rgba(255, 255, 255, 0.1)"};

  &:hover {
    background-color: ${({ isScrolled }) =>
      isScrolled ? "#e9ecef" : "rgba(255, 255, 255, 0.2)"};
  }
`;

const CategoryContainer = styled.div`
  width: 100%;
  background-color: ${({ isScrolled }) =>
    isScrolled ? "rgba(0, 0, 0, 0)" : "rgba(0, 0, 0, 0.0)"};
  border-top: 1px solid
    ${({ isScrolled }) => (isScrolled ? "#e0e0e0" : "rgba(255, 255, 255, 0.2)")};
  padding: 0.5rem 0;
  position: relative;
  overflow: hidden;
`;

const CategoryWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 3rem;
  position: relative;
`;

const CategoryList = styled.div`
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 0.5rem 0;
  margin: 0 -1rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const CategoryItem = styled(Link)`
  text-decoration: none;
  color: ${({ isScrolled }) => (isScrolled ? "#333" : "#ffffff")};
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  white-space: nowrap;
  background-color: ${({ isScrolled }) =>
    isScrolled ? "#f8f9fa" : "rgba(255, 255, 255, 0.1)"};
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ isScrolled }) =>
      isScrolled ? "#e9ecef" : "rgba(255, 255, 255, 0.2)"};
    color: #007bff;
  }
`;

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${({ isScrolled }) =>
    isScrolled ? "#ffffff" : "rgba(255, 255, 255, 0.9)"};
  border: 1px solid
    ${({ isScrolled }) => (isScrolled ? "#e0e0e0" : "rgba(255, 255, 255, 0.2)")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  color: ${({ isScrolled }) => (isScrolled ? "#333" : "#333")};
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  line-height: 1.5;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${({ isScrolled }) =>
      isScrolled ? "#f8f9fa" : "rgba(255, 255, 255, 0.95)"};
  }

  &.left {
    left: 0.5rem;
  }

  &.right {
    right: 0.5rem;
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    transform: translateY(-1px);
  }
`;

const categories = [
  "개발/소프트웨어/IT기술",
  "설비/인프라/유지보수",
  "교육/컨설팅/인증",
  "사무/인쇄/문서서비스",
  "광고/프로모션/판촉물",
  "기계/장비/산업재",
  "생활/복지/서비스",
  "디자인/콘텐츠/마케팅",
  "물류/운송/창고",
  "제조/생산/가공",
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const categoryListRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 기능 구현
    console.log("Searching for:", searchQuery);
  };

  const handleScroll = (direction) => {
    if (categoryListRef.current) {
      const scrollAmount = 200;
      const currentScroll = categoryListRef.current.scrollLeft;
      categoryListRef.current.scrollTo({
        left:
          currentScroll + (direction === "left" ? -scrollAmount : scrollAmount),
        behavior: "smooth",
      });
    }
  };

  const checkScrollButtons = () => {
    if (categoryListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoryListRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const categoryList = categoryListRef.current;
    if (categoryList) {
      categoryList.addEventListener("scroll", checkScrollButtons);
      checkScrollButtons();
      return () =>
        categoryList.removeEventListener("scroll", checkScrollButtons);
    }
  }, []);

  return (
    <HeaderWrapper>
      <HeaderContainer isScrolled={isScrolled}>
        <Nav>
          <Logo to="/" isScrolled={isScrolled}>
            LookPick
          </Logo>
          <SearchContainer>
            <form onSubmit={handleSearch}>
              <SearchInput
                type="text"
                placeholder="업체명, 제품명, 카테고리로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                isScrolled={isScrolled}
              />
            </form>
          </SearchContainer>
          <MenuButton
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            isScrolled={isScrolled}
          >
            ☰
          </MenuButton>
        </Nav>
      </HeaderContainer>
      <CategoryContainer isScrolled={isScrolled}>
        <CategoryWrapper>
          <ScrollButton
            className="left"
            onClick={() => handleScroll("left")}
            visible={showLeftButton}
            isScrolled={isScrolled}
          >
            <span>‹</span>
          </ScrollButton>
          <CategoryList ref={categoryListRef}>
            {categories.map((category, index) => (
              <CategoryItem
                key={index}
                to={`/category/${category}`}
                isScrolled={isScrolled}
              >
                {category}
              </CategoryItem>
            ))}
          </CategoryList>
          <ScrollButton
            className="right"
            onClick={() => handleScroll("right")}
            visible={showRightButton}
            isScrolled={isScrolled}
          >
            <span>›</span>
          </ScrollButton>
        </CategoryWrapper>
      </CategoryContainer>
    </HeaderWrapper>
  );
}

export default Header;
