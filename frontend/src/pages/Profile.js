import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaGraduationCap, FaCalendarAlt } from 'react-icons/fa';
import { ProfileSkeleton } from '../components/LoadingSkeleton';

const ProfileContainer = styled.div`
  padding: 40px 0;
  min-height: calc(100vh - 80px);
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  font-weight: 700;
`;

const ProfileName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
`;

const ProfileLevel = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  display: inline-block;
`;

const ProfileInfo = styled.div`
  display: grid;
  gap: 20px;
`;

const InfoItem = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const InfoLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
`;

const InfoValue = styled.div`
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
`;

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <ProfileContainer>
        <div className="container">
          <ProfileSkeleton />
        </div>
      </ProfileContainer>
    );
  }

  if (!user) {
    return null;
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLevelDescription = (level) => {
    const descriptions = {
      'N5': 'Cơ bản - Có thể hiểu tiếng Nhật cơ bản',
      'N4': 'Sơ cấp - Có thể hiểu tiếng Nhật cơ bản được sử dụng trong các tình huống hàng ngày',
      'N3': 'Trung cấp - Có thể hiểu tiếng Nhật được sử dụng trong các tình huống hàng ngày ở mức độ nhất định',
      'N2': 'Trung cao cấp - Có thể hiểu tiếng Nhật được sử dụng trong các tình huống hàng ngày',
      'N1': 'Cao cấp - Có thể hiểu tiếng Nhật được sử dụng trong nhiều tình huống khác nhau'
    };
    return descriptions[level] || 'Chưa xác định';
  };

  return (
    <ProfileContainer>
      <div className="container">
        <ProfileCard>
          <ProfileHeader>
            <Avatar>
              {getInitials(user.full_name || user.username)}
            </Avatar>
            <ProfileName>{user.full_name || user.username}</ProfileName>
            <ProfileLevel>{user.level}</ProfileLevel>
          </ProfileHeader>

          <ProfileInfo>
            <InfoItem>
              <InfoLabel>
                <FaUser />
                Tên đăng nhập
              </InfoLabel>
              <InfoValue>{user.username}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>
                <FaUser />
                Họ và tên
              </InfoLabel>
              <InfoValue>{user.full_name || 'Chưa cập nhật'}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>
                <FaEnvelope />
                Email
              </InfoLabel>
              <InfoValue>{user.email}</InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>
                <FaGraduationCap />
                Trình độ hiện tại
              </InfoLabel>
              <InfoValue>
                {user.level} - {getLevelDescription(user.level)}
              </InfoValue>
            </InfoItem>

            <InfoItem>
              <InfoLabel>
                <FaCalendarAlt />
                Ngày tham gia
              </InfoLabel>
              <InfoValue>
                {user.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Chưa xác định'}
              </InfoValue>
            </InfoItem>
          </ProfileInfo>
        </ProfileCard>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
