import React, { useState, useEffect } from "react";
import styled from "styled-components";

const SlideContainer = styled.div`
  position: relative;
  width: 100%;
  height: 700px;
  /* overflow: hidden;
  border-radius: ${(props) => props.theme.borderRadius.lg}; */
  /* box-shadow: ${(props) => props.theme.shadows.md}; */

  @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
    height: 300px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    height: 250px;
  }
`;

const SlideWrapper = styled.div`
  display: flex;
  width: ${(props) => props.slideCount * 100}%;
  height: 100%;
  transform: translateX(
    -${(props) => props.currentSlide * (100 / props.slideCount)}%
  );
  transition: transform 0.5s ease-in-out;
`;

const Slide = styled.div`
  width: ${(props) => 100 / props.slideCount}%;
  height: 100%;
  position: relative;
  background: linear-gradient(
    135deg,
    ${(props) => props.bgColor1} 0%,
    ${(props) => props.bgColor2} 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const SlideContent = styled.div`
  text-align: center;
  color: white;
  z-index: 2;

  h2 {
    font-size: 2.5rem;
    margin-bottom: ${(props) => props.theme.spacing.md};
    font-weight: bold;

    @media (max-width: ${(props) => props.theme.breakpoints.tablet}) {
      font-size: 2rem;
    }

    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: 1.5rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;

    @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
      font-size: 1rem;
    }
  }
`;

const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.8);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-50%) scale(1.1);
  }

  &.prev {
    left: 20px;
  }

  &.next {
    right: 20px;
  }

  @media (max-width: ${(props) => props.theme.breakpoints.mobile}) {
    width: 40px;
    height: 40px;

    &.prev {
      left: 10px;
    }

    &.next {
      right: 10px;
    }
  }
`;

const DotsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
`;

const Dot = styled.button`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background: ${(props) =>
    props.active ? "white" : "rgba(255, 255, 255, 0.5)"};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    transform: scale(1.2);
  }
`;

const ImageSlide = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "title",
      description: "description",
      bgColor1: "#FF6B6B",
      bgColor2: "#4ECDC4",
    },
    {
      id: 2,
      title: "title",
      description: "description",
      bgColor1: "#45B7D1",
      bgColor2: "#96CEB4",
    },
    {
      id: 3,
      title: "title",
      description: "description",
      bgColor1: "#FECA57",
      bgColor2: "#FF9FF3",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 자동 슬라이드
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SlideContainer>
      <SlideWrapper currentSlide={currentSlide} slideCount={slides.length}>
        {slides.map((slide, index) => (
          <Slide
            key={slide.id}
            slideCount={slides.length}
            bgColor1={slide.bgColor1}
            bgColor2={slide.bgColor2}
          >
            <SlideContent>
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
            </SlideContent>
          </Slide>
        ))}
      </SlideWrapper>

      <NavigationButton className="prev" onClick={prevSlide}>
        &#8249;
      </NavigationButton>
      <NavigationButton className="next" onClick={nextSlide}>
        &#8250;
      </NavigationButton>

      <DotsContainer>
        {slides.map((_, index) => (
          <Dot
            key={index}
            active={currentSlide === index}
            onClick={() => goToSlide(index)}
          />
        ))}
      </DotsContainer>
    </SlideContainer>
  );
};

export default ImageSlide;
