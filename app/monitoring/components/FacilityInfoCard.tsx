'use client';

import Image from 'next/image';
import styled from '@emotion/styled';
import { MdLocationOn, MdPhone } from 'react-icons/md';
import { BsCircleFill } from 'react-icons/bs';

interface FacilityInfoCardProps {
  name: string;
  type: string;
  address: string;
  status: 'open' | 'closed' | 'preparing';
  phone: string;
  imageUrl: string;
}

export default function FacilityInfoCard({
  name,
  type,
  address,
  status,
  phone,
  imageUrl,
}: FacilityInfoCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return '#00AB75';
      case 'closed':
        return '#FF4D4D';
      case 'preparing':
        return '#FFB800';
      default:
        return '#767676';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return '영업 중';
      case 'closed':
        return '영업 종료';
      case 'preparing':
        return '준비 중';
      default:
        return '상태 미확인';
    }
  };

  return (
    <Container>
      <ImageContainer>
        <Image
          src={imageUrl}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 378px) 100vw, 378px"
          quality={100}
          priority
        />
      </ImageContainer>
      <InfoContainer>
        <Type>{type}</Type>
        <Name>{name}</Name>
        <Divider />
        <InfoRow>
          <IconWrapper>
            <MdLocationOn size={16} color="#767676" />
          </IconWrapper>
          <Text>{address}</Text>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <BsCircleFill size={13} color={getStatusColor(status)} />
          </IconWrapper>
          <StatusText color={getStatusColor(status)}>
            {getStatusText(status)}
          </StatusText>
        </InfoRow>
        <InfoRow>
          <IconWrapper>
            <MdPhone size={16} color="#767676" />
          </IconWrapper>
          <Text>{phone}</Text>
        </InfoRow>
      </InfoContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 36px;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 358px;
`;

const InfoContainer = styled.div`
  padding: 32px;
`;

const Type = styled.div`
  font-family: 'Pretendard';
  font-size: 16px;
  color: #767676;
  margin-bottom: 4px;
`;

const Name = styled.h2`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 28px;
  color: #111111;
  margin: 0;
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  background-color: #767676;
  margin: 28px 0;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
`;

const Text = styled.span`
  font-family: 'Pretendard';
  font-size: 16px;
  color: #111111;
`;

const StatusText = styled.span<{ color: string }>`
  font-family: 'Pretendard';
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.color};
`;
