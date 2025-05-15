import React from 'react';
import styled from 'styled-components';

const Container = styled.footer`
  width: 100%;
  background-color: #111111;
  padding: clamp(40px, 2.08vw, 40px) clamp(1rem, 8.33vw, 160px);
  color: #ffffff;
  user-select: none;

  @media (max-width: 1366px) {
    padding: 40px 40px;
  }

  @media (max-width: 768px) {
    padding: 32px 20px;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 40rem;
  max-width: 1280px;
  margin: 0 auto;

  @media (max-width: 1366px) {
    gap: 20rem;
  }

  @media (max-width: 1024px) {
    gap: 10rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const LogoSection = styled.div`
  width: 320px;
  flex: 0 0 320px;

  @media (max-width: 768px) {
    width: 100%;
    flex: none;
  }

  .logo-wrapper {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    height: 24px;

    @media (max-width: 768px) {
      height: 20px;
      margin-bottom: 0.75rem;
    }

    img {
      width: clamp(40px, 3.125vw, 60px);
      height: auto;
      object-fit: contain;

      @media (max-width: 768px) {
        width: 36px;
      }
    }

    span {
      font-family: 'Pretendard';
      font-size: clamp(14px, 0.83vw, 16px);
      font-weight: 600;
      color: #ffffff;

      @media (max-width: 768px) {
        font-size: 14px;
      }
    }
  }

  p {
    font-family: 'Pretendard';
    font-size: clamp(12px, 0.73vw, 14px);
    line-height: 1.5;
    color: #767676;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 12px;
      line-height: 1.4;
    }
  }
`;

const MenuSection = styled.div`
  width: 320px;
  flex: 0 0 320px;
  display: flex;
  justify-content: space-between;
  gap: clamp(24px, 2.5vw, 48px);

  @media (max-width: 1024px) {
    width: 280px;
    flex: 0 0 280px;
    gap: 20px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuColumn = styled.div`
  flex: 1;

  @media (max-width: 768px) {
    display: none;
  }

  h3 {
    font-family: 'Pretendard';
    font-weight: 600;
    font-size: clamp(14px, 0.83vw, 16px);
    color: #ffffff;
    margin: 0;
    margin-bottom: 1rem;

    @media (max-width: 768px) {
      font-size: 14px;
      margin-bottom: 0.75rem;
    }
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      margin-bottom: 0.75rem;

      @media (max-width: 768px) {
        margin-bottom: 0.5rem;
      }

      a {
        font-family: 'Pretendard';
        font-size: clamp(12px, 0.73vw, 14px);
        color: #767676;
        text-decoration: none;
        transition: color 0.2s;

        @media (max-width: 768px) {
          font-size: 12px;
        }

        &:hover {
          color: #ffffff;
        }
      }
    }
  }
`;

const AddressSpan = styled.span`
  white-space: nowrap;

  @media (max-width: 768px) {
    white-space: normal;
  }
`;

const Footer: React.FC = () => {
  return (
    <Container>
      <FooterContent>
        <LogoSection>
          <div className="logo-wrapper">
            <img src="/images/ge_logo.png" alt="GE Logo" />
            <span>(주)지이</span>
          </div>
          <p>
            <AddressSpan>
              본사 : 경기도 광명시 덕안로104번길 17 (광명역 엠클러스터 1306~7호)
            </AddressSpan>
            <br />
            <AddressSpan>
              지사 : 강원도 삼척시 언장1길 27 에너지방재지원센터 208호
            </AddressSpan>
            <br />
            전화 : 02-6335-0416
            <br />
            팩스 : 02-6335-0422
            <br />
            메일 : ge@ge-enov.com
          </p>
        </LogoSection>

        <MenuSection>
          <MenuColumn>
            <h3>회사소개</h3>
            <ul>
              <li>
                <a href="#">기업정보</a>
              </li>
              <li>
                <a href="#">연혁</a>
              </li>
              <li>
                <a href="#">오시는 길</a>
              </li>
            </ul>
          </MenuColumn>

          <MenuColumn>
            <h3>사업영역</h3>
            <ul>
              <li>
                <a href="#">수소충전소</a>
              </li>
              <li>
                <a href="#">모니터링</a>
              </li>
              <li>
                <a href="#">압축기</a>
              </li>
            </ul>
          </MenuColumn>

          <MenuColumn>
            <h3>고객지원</h3>
            <ul>
              <li>
                <a href="#">공지사항</a>
              </li>
              <li>
                <a href="#">문의하기</a>
              </li>
              <li>
                <a href="#">자료실</a>
              </li>
            </ul>
          </MenuColumn>
        </MenuSection>
      </FooterContent>
    </Container>
  );
};

export default Footer;
