import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { 
  FaUsers, 
  FaBook, 
  FaQuestionCircle, 
  FaChartLine,
  FaClock,
  FaTrophy 
} from 'react-icons/fa';

const DashboardContainer = styled.div`
  max-width: 1200px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#667eea'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  color: ${props => props.color || '#667eea'};
  margin-bottom: 10px;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-weight: 500;
`;

const SectionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #333;
`;

const UserEmail = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const UserDate = styled.span`
  font-size: 0.8rem;
  color: #999;
`;

const ResultItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultUser = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
`;

const ResultQuiz = styled.div`
  font-size: 0.8rem;
  color: #666;
`;

const ResultScore = styled.div`
  font-weight: 600;
  color: ${props => props.score >= 60 ? '#4CAF50' : '#f44336'};
  font-size: 1.1rem;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #666;
`;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <DashboardContainer>
        <PageTitle>Dashboard</PageTitle>
        <LoadingCard>Đang tải dữ liệu...</LoadingCard>
      </DashboardContainer>
    );
  }

  return (
    <DashboardContainer>
      <PageTitle>Admin Dashboard</PageTitle>
      
      <StatsGrid>
        <StatCard color="#667eea">
          <StatIcon color="#667eea">
            <FaUsers />
          </StatIcon>
          <StatNumber>{stats?.totalUsers || 0}</StatNumber>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        
        <StatCard color="#4CAF50">
          <StatIcon color="#4CAF50">
            <FaBook />
          </StatIcon>
          <StatNumber>{stats?.totalCourses || 0}</StatNumber>
          <StatLabel>Total Courses</StatLabel>
        </StatCard>
        
        <StatCard color="#FF9800">
          <StatIcon color="#FF9800">
            <FaQuestionCircle />
          </StatIcon>
          <StatNumber>{stats?.totalQuizzes || 0}</StatNumber>
          <StatLabel>Total Quizzes</StatLabel>
        </StatCard>
        
        <StatCard color="#f44336">
          <StatIcon color="#f44336">
            <FaChartLine />
          </StatIcon>
          <StatNumber>{stats?.totalAttempts || 0}</StatNumber>
          <StatLabel>Quiz Attempts</StatLabel>
        </StatCard>
      </StatsGrid>
      
      <SectionGrid>
        <Section>
          <SectionTitle>
            <FaClock />
            Recent Users
          </SectionTitle>
          {stats?.recentUsers?.length > 0 ? (
            stats.recentUsers.map((user, index) => (
              <UserItem key={index}>
                <UserInfo>
                  <UserName>{user.username}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserInfo>
                <UserDate>{formatDate(user.created_at)}</UserDate>
              </UserItem>
            ))
          ) : (
            <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No recent users
            </div>
          )}
        </Section>
        
        <Section>
          <SectionTitle>
            <FaTrophy />
            Recent Quiz Results
          </SectionTitle>
          {stats?.recentResults?.length > 0 ? (
            stats.recentResults.map((result, index) => (
              <ResultItem key={index}>
                <ResultInfo>
                  <ResultUser>{result.username}</ResultUser>
                  <ResultQuiz>{result.quiz_title}</ResultQuiz>
                </ResultInfo>
                <ResultScore score={result.score}>
                  {Number(result.score).toFixed(1)}%
                </ResultScore>
              </ResultItem>
            ))
          ) : (
            <div style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
              No recent results
            </div>
          )}
        </Section>
      </SectionGrid>
    </DashboardContainer>
  );
};

export default AdminDashboard;
