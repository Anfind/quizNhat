import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaChartLine, FaCalendarAlt, FaClock, FaCheck, FaTimes, FaEye } from 'react-icons/fa';

const ResultsContainer = styled.div`
  padding: 40px 0;
  min-height: calc(100vh - 80px);
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  color: white;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 15px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const PageSubtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const StatIcon = styled.div`
  font-size: 2.5rem;
  color: ${props => props.color || '#667eea'};
  margin-bottom: 15px;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-weight: 500;
`;

const ResultsSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ResultsGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const ResultCard = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 16px;
  padding: 25px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.1);
  }
`;

const ResultHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const ResultInfo = styled.div`
  flex: 1;
`;

const ResultTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const ResultSubtitle = styled.div`
  color: #666;
  margin-bottom: 10px;
`;

const ResultScore = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.passed ? '#4CAF50' : '#f44336'};
  text-align: right;
`;

const ResultDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
`;

const ResultActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const ActionButton = styled(Link)`
  padding: 8px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
`;

const ViewButton = styled(ActionButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
`;

const RetakeButton = styled(ActionButton)`
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  
  &:hover {
    background: #667eea;
    color: white;
  }
`;

const ScoreDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PassedBadge = styled.span`
  background: ${props => props.passed ? '#4CAF50' : '#f44336'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const NoResultsMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  padding: 60px 20px;
`;

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    passedQuizzes: 0,
    totalTime: 0
  });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('/api/user/results');
      const resultsData = response.data;
      setResults(resultsData);
      calculateStats(resultsData);
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (resultsData) => {
    if (resultsData.length === 0) return;

    const totalQuizzes = resultsData.length;
    const averageScore = resultsData.reduce((sum, result) => sum + Number(result.score), 0) / totalQuizzes;
    const passedQuizzes = resultsData.filter(result => Number(result.score) >= 60).length;
    const totalTime = resultsData.reduce((sum, result) => sum + Number(result.time_taken), 0);

    setStats({
      totalQuizzes,
      averageScore,
      passedQuizzes,
      totalTime: Math.floor(totalTime / 60) // Convert to minutes
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <ResultsContainer>
        <div className="container">
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </div>
      </ResultsContainer>
    );
  }

  return (
    <ResultsContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>Kết quả học tập</PageTitle>
          <PageSubtitle>Theo dõi tiến độ và thành tích của bạn</PageSubtitle>
        </PageHeader>

        <StatsGrid>
          <StatCard>
            <StatIcon color="#667eea">
              <FaChartLine />
            </StatIcon>
            <StatNumber>{stats.totalQuizzes}</StatNumber>
            <StatLabel>Bài thi đã làm</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon color="#4CAF50">
              <FaCheck />
            </StatIcon>
            <StatNumber>{stats.averageScore.toFixed(1)}%</StatNumber>
            <StatLabel>Điểm trung bình</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon color="#FF9800">
              <FaCheck />
            </StatIcon>
            <StatNumber>{stats.passedQuizzes}</StatNumber>
            <StatLabel>Bài thi đạt</StatLabel>
          </StatCard>

          <StatCard>
            <StatIcon color="#9C27B0">
              <FaClock />
            </StatIcon>
            <StatNumber>{stats.totalTime}</StatNumber>
            <StatLabel>Phút học tập</StatLabel>
          </StatCard>
        </StatsGrid>

        <ResultsSection>
          <SectionTitle>
            <FaChartLine />
            Lịch sử làm bài ({results.length})
          </SectionTitle>

          {results.length > 0 ? (
            <ResultsGrid>
              {results.map((result) => (
                <ResultCard key={result.id}>
                  <ResultHeader>
                    <ResultInfo>
                      <ResultTitle>{result.quiz_title}</ResultTitle>
                      <ResultSubtitle>{result.course_title} • {result.level}</ResultSubtitle>
                    </ResultInfo>
                    <ScoreDisplay>
                      <ResultScore passed={Number(result.score) >= 60}>
                        {Number(result.score).toFixed(1)}%
                      </ResultScore>
                      <PassedBadge passed={Number(result.score) >= 60}>
                        {Number(result.score) >= 60 ? 'ĐẠT' : 'CHƯA ĐẠT'}
                      </PassedBadge>
                    </ScoreDisplay>
                  </ResultHeader>

                  <ResultDetails>
                    <DetailItem>
                      <FaCheck />
                      {result.correct_answers}/{result.total_questions} đúng
                    </DetailItem>
                    <DetailItem>
                      <FaClock />
                      {formatTime(result.time_taken)}
                    </DetailItem>
                    <DetailItem>
                      <FaCalendarAlt />
                      {formatDate(result.completed_at)}
                    </DetailItem>
                  </ResultDetails>

                  <ResultActions>
                    <ViewButton to={`/result/${result.id}`}>
                      <FaEye />
                      Xem chi tiết
                    </ViewButton>
                    <RetakeButton to={`/quiz/${result.quiz_id}`}>
                      Làm lại
                    </RetakeButton>
                  </ResultActions>
                </ResultCard>
              ))}
            </ResultsGrid>
          ) : (
            <NoResultsMessage>
              Bạn chưa làm bài thi nào. <Link to="/" style={{ color: '#667eea' }}>Bắt đầu học ngay!</Link>
            </NoResultsMessage>
          )}
        </ResultsSection>
      </div>
    </ResultsContainer>
  );
};

export default Results;
