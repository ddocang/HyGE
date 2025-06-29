import React, { useState } from 'react';
import styled from 'styled-components';
import { BiEnvelope, BiLock } from 'react-icons/bi';
import { BiUserPlus } from 'react-icons/bi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const LoginContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background-color: black;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: url('/images/main1.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.7;
    z-index: 0;

    @media (max-width: 768px) {
      background-image: url('/images/main/mobile_bg_01.jpg');
    }
  }
`;

const LoginBox = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
  backdrop-filter: blur(10px);

  h1 {
    text-align: center;
    color: #333;
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-top: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;

  input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    border: 2px solid #e1e1e1;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;

    &:focus {
      border-color: #4a90e2;
      outline: none;
    }
  }

  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    font-size: 1.2rem;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #357abd;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ForgotPassword = styled.div`
  text-align: right;
  margin-top: -0.5rem;

  a {
    color: #666;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      color: #4a90e2;
      text-decoration: underline;
    }
  }
`;

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 허용된 아이디 목록 (소문자)
    const allowedIds = ['ge', 'kwtp', 'kd', 'ob'];
    const inputId = formData.id.trim().toLowerCase();
    if (!allowedIds.includes(inputId)) {
      alert('존재하지 않는 아이디입니다');
      return;
    }
    if (formData.password !== '0000') {
      alert('비밀번호가 올바르지 않습니다');
      return;
    }
    localStorage.setItem('loginId', inputId);
    router.push('/');
  };

  return (
    <LoginContainer>
      <LoginBox>
        <h1>로그인</h1>
        <div
          style={{
            textAlign: 'center',
            color: '#666',
            fontSize: '1rem',
            marginBottom: '1.2rem',
            marginTop: '-1rem',
            fontFamily: 'Pretendard',
            fontWeight: 500,
          }}
        >
          로그인하기 위해서는 관리자 아이디를 부여받아야 합니다
        </div>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <BiUserPlus />
            <input
              type="text"
              name="id"
              placeholder="아이디"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <BiLock />
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </InputGroup>
          <LoginButton type="submit">로그인</LoginButton>
        </Form>
      </LoginBox>
    </LoginContainer>
  );
};

export default LoginForm;
