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
`;

const Section01Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section01Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  letter-spacing: -0.02em;
`;

const Section01Subtitle = styled.p`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 600px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 600px;
`;

const FeatureItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;

  &::before {
    content: "•";
    color: #007bff;
    font-size: 1.5rem;
  }
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
`;

// const ScrollIndicator = styled.div`
//   position: absolute;
//   bottom: 3rem;
//   left: 50%;
//   transform: translateX(-50%);
//   color: white;
//   font-size: 1rem;
//   opacity: 0.9;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   gap: 0.8rem;
//   z-index: 2;

//   &::after {
//     content: "";
//     width: 24px;
//     height: 24px;
//     border-right: 2px solid white;
//     border-bottom: 2px solid white;
//     transform: rotate(45deg);
//     animation: scrollDown 2s infinite;
//   }

//   @keyframes scrollDown {
//     0% {
//       transform: rotate(45deg) translate(-5px, -5px);
//       opacity: 0;
//     }
//     50% {
//       opacity: 1;
//     }
//     100% {
//       transform: rotate(45deg) translate(5px, 5px);
//       opacity: 0;
//     }
//   }
// `;

// const Section = styled.section`
//   padding: 6rem 0;
//   position: relative;
//   overflow: hidden;
//   width: 100vw;
//   margin-left: calc(-50vw + 50%);
//   margin-right: calc(-50vw + 50%);
//   left: 0;
//   right: 0;

//   &:nth-child(even) {
//     background: #f8f9fa;
//   }
// `;

// const SectionContent = styled.div`
//   max-width: 1400px;
//   margin: 0 auto;
//   padding: 0 2rem;
//   width: 100%;
// `;

// const SectionTitle = styled.h2`
//   font-size: 2.8rem;
//   margin-bottom: 3rem;
//   color: #333;
//   text-align: center;
//   position: relative;
//   font-weight: 700;

//   &:after {
//     content: "";
//     position: absolute;
//     bottom: -15px;
//     left: 50%;
//     transform: translateX(-50%);
//     width: 120px;
//     height: 4px;
//     background: linear-gradient(90deg, #007bff, #00bfff);
//     border-radius: 2px;
//   }
// `;

// const CtaSection = styled(Section)`
//   text-align: center;
//   background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
//     url("https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80");
//   background-size: cover;
//   background-position: center;
//   background-attachment: fixed;
//   color: black;
//   position: relative;

//   &::before {
//     content: "";
//     position: absolute;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     background: rgba(0, 0, 0, 0.4);
//     backdrop-filter: blur(6px);
//     -webkit-backdrop-filter: blur(6px);
//     pointer-events: none;
//   }
// `;

// const CtaContent = styled.div`
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 0 2rem;
//   transform: translateY(50px);
//   opacity: 0;
//   position: relative;
//   z-index: 1;
// `;

// const CtaTitle = styled.h2`
//   font-size: 3rem;
//   margin-bottom: 1.5rem;
//   font-weight: 700;
// `;

// const CtaDescription = styled.p`
//   font-size: 1.3rem;
//   margin-bottom: 2rem;
//   opacity: 0.9;
//   line-height: 1.8;
// `;

// const CtaButton = styled.button`
//   background: linear-gradient(45deg, #007bff, #00bfff);
//   color: white;
//   border: none;
//   padding: 1rem 3rem;
//   font-size: 1.2rem;
//   border-radius: 30px;
//   cursor: pointer;
//   transition: all 0.3s ease;
//   box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);

//   &:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
//   }
// `;

// const FeaturesSection = styled(Section)`
//   background: white;
// `;

// const FeaturesGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(2, 1fr);
//   gap: 3rem;
//   margin-bottom: 4rem;

//   @media (max-width: 1024px) {
//     grid-template-columns: 1fr;
//   }
// `;

// const FeatureCard = styled.div`
//   background: white;
//   border-radius: 20px;
//   padding: 2.5rem;
//   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//   transform: translateY(50px);
//   opacity: 0;
//   transition: all 0.3s ease;
//   border: 1px solid rgba(0, 0, 0, 0.05);

//   &:hover {
//     transform: translateY(-5px);
//     box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
//   }

//   .title {
//     font-size: 1.8rem;
//     font-weight: 700;
//     margin-bottom: 1.5rem;
//     color: #333;
//   }

//   .description {
//     color: #666;
//     font-size: 1.1rem;
//     line-height: 1.8;
//   }
// `;

const ReservationForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  max-width: 600px;
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ReservationMessage = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${(props) => (props.isError ? "#ff4d4d" : "rgba(255, 255, 255, 0.8)")};
`;

function Home() {
  const section01Ref = useRef(null);
  const section01ContentRef = useRef(null);
  const featureRefs = useRef([]);
  const ctaRef = useRef(null);
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");

    try {
      const templateParams = {
        to_email: email,
        title: "사전예약",
        from_name: "LookPick",
        message: "사전예약이 완료되었습니다. 서비스 오픈 시 알려드리겠습니다.",
        url: "https://naver.com",
      };

      await emailjs.send(
        "service_ndqig2q", // EmailJS 서비스 ID
        "template_ssxaya9", // EmailJS 템플릿 ID
        templateParams,
        "zzG_oVRkKVGiKqmec" // EmailJS 공개 키
      );

      setIsSubmitted(true);
      setEmail("");
    } catch (err) {
      console.error("Email sending failed:", err);
      setError("이메일 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
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
            {error && <ReservationMessage isError>{error}</ReservationMessage>}
            {isSubmitted && (
              <ReservationMessage>
                사전예약이 완료되었습니다. 확인 이메일을 발송했습니다.
              </ReservationMessage>
            )}
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
    </HomeContainer>
  );
}
// https://noppap.com/about
// https://noppap.com/about
export default Home;
