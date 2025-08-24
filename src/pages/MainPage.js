import styled from "styled-components";
import MainContent from "../components/main/MainContent";
import Section1 from "../components/main/Section1";
import Section2 from "../components/main/Section2";
import Section3 from "../components/main/Section3";

const MainContainer = styled.div`
  min-height: 80vh;
`;

const MainSection = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  margin: 0 auto;
  background-image: url('https://picsum.photos/1920/1080?random=${Math.floor(Math.random() * 1000)}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.8);
    z-index: 1;
  }
`;



const CategorySection = styled.div`
  padding: 20px;
  background-color: ${(props) => props.theme.colors.white};
`;

const MainPage = () => {
  return (
    <MainContainer>
      <MainSection>
        <MainContent />
      </MainSection>

      {/* 개발용 디버그 정보 */}

      <CategorySection>

      </CategorySection>

      <Section1 />

      <Section2 />

      <Section3 />


    </MainContainer>
  );
};

export default MainPage;
