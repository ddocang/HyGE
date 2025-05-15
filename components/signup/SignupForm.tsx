import React, { useState } from 'react';
import styled from 'styled-components';
import { BiUserPlus, BiEnvelope, BiLock, BiPhone } from 'react-icons/bi';
import Link from 'next/link';

const SignupContainer = styled.div`
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

const SignupBox = styled.div`
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

const SubmitButton = styled.button`
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

const LoginLink = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #666;

  a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 회원가입 API 연동
    console.log('Form submitted:', formData);
  };

  return (
    <SignupContainer>
      <SignupBox>
        <h1>회원가입</h1>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <BiUserPlus />
            <input
              type="text"
              name="username"
              placeholder="사용자 이름"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <BiEnvelope />
            <input
              type="email"
              name="email"
              placeholder="이메일 주소"
              value={formData.email}
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
            />
          </InputGroup>
          <InputGroup>
            <BiLock />
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <InputGroup>
            <BiPhone />
            <input
              type="tel"
              name="phone"
              placeholder="전화번호"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </InputGroup>
          <SubmitButton type="submit">가입하기</SubmitButton>
        </Form>
        <LoginLink>
          이미 계정이 있으신가요? <Link href="/login">로그인</Link>
        </LoginLink>
      </SignupBox>
    </SignupContainer>
  );
};

export default SignupForm;
