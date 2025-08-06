import styled from "styled-components";
import ImageSlide from "../components/main/ImageSlide";
import CategoryList from "../components/main/CategoryList";

const MainContainer = styled.div`
  min-height: 80vh;
`;

const SlideSection = styled.div`
  width: 100%;
  overflow: hidden;
  margin: 0 auto;
`;

const CategorySection = styled.div`
  padding: 20px;
  background-color: ${(props) => props.theme.colors.white};
`;

const MainPage = () => {
  return (
    <MainContainer>
      <SlideSection>
        <ImageSlide />
      </SlideSection>

      {/* 개발용 디버그 정보 */}

      <CategorySection>
        <CategoryList />
      </CategorySection>
    </MainContainer>
  );
};

export default MainPage;
