import React, { useRef, useEffect, useState } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";

gsap.registerPlugin(ScrollTrigger);

const HomeContainer = styled.div``;

const Section01 = styled.section`
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)),
    url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  left: 0;
  right: 0;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      rgba(0, 0, 0, 0.5) 100%
    );
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    pointer-events: none;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    pointer-events: none;
  }
  @media (max-width: 768px) {
    height: 150vh;
  }
`;

const Section01Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;

  @media (max-width: 1024px) {
    gap: 3rem;
    padding: 0 1.5rem;
  }

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 2.5rem;
    padding: 0 1rem;
    text-align: center;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
    align-items: center;
  }
`;

const Section01Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (max-width: 1024px) {
    font-size: 3rem;
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Section01Subtitle = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 600px;

  @media (max-width: 1024px) {
    font-size: 1.1rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const FeatureItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FeatureTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  @media (max-width: 1024px) {
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    justify-content: center;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }

  &::before {
    content: "•";
    color: #007bff;
    font-size: 1.5rem;

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }

    @media (max-width: 480px) {
      font-size: 1.2rem;
    }
  }
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;

  @media (max-width: 1024px) {
    font-size: 0.95rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    text-align: left;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;

const ReservationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  max-width: 600px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 1rem;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;

  @media (max-width: 1024px) {
    font-size: 0.95rem;
    padding: 0.9rem 1.3rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.7rem 1rem;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ReservationButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 30px;
  background: linear-gradient(45deg, #007bff, #00bfff);
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);

  @media (max-width: 1024px) {
    font-size: 0.95rem;
    padding: 0.9rem 1.8rem;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.7rem 1.3rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    `
    opacity: 1;
    visibility: visible;
  `}
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
  transform: scale(0.7);
  transition: transform 0.3s ease;

  ${({ $isOpen }) =>
    $isOpen &&
    `
    transform: scale(1);
  `}
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ModalMessage = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ModalButton = styled.button`
  background: linear-gradient(45deg, #007bff, #00bfff);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    padding: 0.7rem 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.6rem 1.5rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  }
`;

const ErrorModalContent = styled(ModalContent)`
  border-left: 4px solid #ff4d4d;
`;

function Home() {
  const section01Ref = useRef(null);
  const section01ContentRef = useRef(null);
  const featureRefs = useRef([]);
  const ctaRef = useRef(null);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");

  useEffect(() => {
    // Section01 애니메이션
    gsap.to(section01ContentRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
    });

    // 배경 패럴랙스 효과
    gsap.to(section01Ref.current, {
      backgroundPosition: "50% 100%",
      ease: "none",
      scrollTrigger: {
        trigger: section01Ref.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Feature 카드 애니메이션
    featureRefs.current.forEach((feature, index) => {
      gsap.to(feature, {
        scrollTrigger: {
          trigger: feature,
          start: "top bottom",
          end: "top center",
          scrub: 0.5,
          toggleActions: "play none none reverse",
        },
        y: 0,
        opacity: 1,
        duration: 1,
        delay: index * 0.2,
        ease: "power2.out",
      });
    });

    // CTA 섹션 애니메이션
    gsap.to(ctaRef.current, {
      scrollTrigger: {
        trigger: ctaRef.current,
        start: "top bottom",
        end: "top center",
        scrub: 0.5,
        toggleActions: "play none none reverse",
      },
      y: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  const handleReservation = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const templateParams = {
        email: email,
        title: "사전예약",
        from_name: "LookPick",
      };

      await emailjs.send(
        "service_6jzjgyl",
        "template_qqdruyj",
        templateParams,
        "UMoV_XrPTAxXkUfi6"
      );

      setEmail("");
      setModalType("success");
      setShowModal(true);
    } catch (err) {
      console.error("Email sending failed:", err);
      setModalType("error");
      setShowModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <HomeContainer>
      <Section01 ref={section01Ref}>
        <Section01Content ref={section01ContentRef}>
          <TitleWrapper>
            <Section01Title>
              모든 업종을 한 곳에, <br />
              간편한 홍보와 검색을 동시에
            </Section01Title>
            <Section01Subtitle>
              업체의 온라인 명함, 이제 여기 하나면 충분합니다. <br />
              광고비는 줄이고, 노출은 늘리세요.
            </Section01Subtitle>
            <ReservationForm onSubmit={handleReservation}>
              <EmailInput
                type="email"
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
              <ReservationButton type="submit" disabled={isLoading}>
                {isLoading ? "처리중..." : "사전예약하기"}
              </ReservationButton>
            </ReservationForm>
          </TitleWrapper>
          <FeatureList>
            <FeatureItem>
              <FeatureTitle>간편한 등록, 효과적인 노출</FeatureTitle>
              <FeatureDescription>
                '네이버 지도' 등록만으로 효과적인 마케팅을 하고 싶은 업체들처럼,
                많은 업체들은 별도 마케팅 없이도 고객에게 보이길 원합니다. 우리
                플랫폼은 간단한 등록만으로도 카테고리별 노출이 가능해, 소규모
                B2B 업체부터 큰 기업까지 효율적인 홍보가 가능합니다.
              </FeatureDescription>
            </FeatureItem>
            <FeatureItem>
              <FeatureTitle>검색 엔진의 비효율성 해소</FeatureTitle>
              <FeatureDescription>
                소비자들은 필요한 업체를 찾기 위해 매번 복잡한 검색어를
                입력하고, 여러 개의 홈페이지를 들락날락하며 직접 비교해야
                합니다. 우리 플랫폼은 유사 업종을 보기 좋게 정리하여, 빠르고
                직관적인 비교 탐색을 가능하게 합니다.
              </FeatureDescription>
            </FeatureItem>
            <FeatureItem>
              <FeatureTitle>전시회 중심 노출 마케팅의 한계 극복</FeatureTitle>
              <FeatureDescription>
                오프라인 전시회, 박람회에 의존한 홍보 방식은 비용 대비 노출
                효과가 제한적이며 일시적이기 때문에 지속적인 고객 유입이
                어렵습니다. 우리 플랫폼은 온라인 기반으로, 언제 어디서나 업체
                정보를 손쉽게 탐색하고 노출시킬 수 있도록 돕습니다.
              </FeatureDescription>
            </FeatureItem>
          </FeatureList>
        </Section01Content>
      </Section01>

      <ModalOverlay $isOpen={showModal} onClick={closeModal}>
        <ModalContent
          $isOpen={showModal}
          as={modalType === "error" ? ErrorModalContent : undefined}
          onClick={(e) => e.stopPropagation()}
        >
          {modalType === "success" ? (
            <>
              <ModalTitle>사전예약 완료!</ModalTitle>
              <ModalMessage>
                입력하신 이메일로 사전예약 안내를 보내드립니다. <br /> 메일에
                답변해주셔야 예약이 완료됩니다.
              </ModalMessage>
            </>
          ) : (
            <>
              <ModalTitle>예약 실패</ModalTitle>
              <ModalMessage>
                이메일 전송에 실패했습니다.
                <br />
                다시 시도해주세요.
              </ModalMessage>
            </>
          )}
          <ModalButton onClick={closeModal}>확인</ModalButton>
        </ModalContent>
      </ModalOverlay>
    </HomeContainer>
  );
}
// https://noppap.com/about
// https://noppap.com/about
export default Home;
