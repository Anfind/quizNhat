import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaPlay, FaClock, FaBook, FaQuestionCircle, FaArrowLeft } from 'react-icons/fa';

const CourseDetailContainer = styled.div`
  padding: 40px 0;
  min-height: calc(100vh - 80px);
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-5px);
  }
`;

const CourseHeader = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
`;

const CourseLevel = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 20px;
`;

const CourseTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.2;
`;

const CourseDescription = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
`;

const CourseStats = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  font-size: 1rem;
  
  svg {
    color: #667eea;
    font-size: 1.2rem;
  }
`;

const VideoSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
`;

const VideoTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

const QuizSection = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
`;

const QuizTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuizGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const QuizCard = styled(Link)`
  background: linear-gradient(135deg, #f8f9ff 0%, #e8ebff 100%);
  border: 2px solid #e1e5e9;
  border-radius: 16px;
  padding: 25px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
  }
`;

const QuizCardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const QuizCardDescription = styled.p`
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
`;

const QuizCardStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #666;
`;

const StartQuizButton = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
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

const ErrorMessage = styled.div`
  text-align: center;
  color: white;
  font-size: 1.2rem;
  padding: 60px 20px;
`;

const NoQuizzesMessage = styled.div`
  text-align: center;
  color: #666;
  font-size: 1.1rem;
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourseDetails();
    fetchQuizzes();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}`);
      setCourse(response.data);
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Không thể tải thông tin khóa học');
    }
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`/api/courses/${id}/quizzes`);
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <CourseDetailContainer>
        <div className="container">
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </div>
      </CourseDetailContainer>
    );
  }

  if (error || !course) {
    return (
      <CourseDetailContainer>
        <div className="container">
          <ErrorMessage>{error || 'Khóa học không tồn tại'}</ErrorMessage>
        </div>
      </CourseDetailContainer>
    );
  }

  return (
    <CourseDetailContainer>
      <div className="container">
        <BackButton to="/">
          <FaArrowLeft />
          Quay lại trang chủ
        </BackButton>

        <CourseHeader>
          <CourseLevel>{course.level}</CourseLevel>
          <CourseTitle>{course.title}</CourseTitle>
          <CourseDescription>{course.description}</CourseDescription>
          
          <CourseStats>
            <StatItem>
              <FaClock />
              Thời lượng: {course.duration} phút
            </StatItem>
            <StatItem>
              <FaBook />
              Cấp độ: {course.level}
            </StatItem>
          </CourseStats>
        </CourseHeader>

        {course.video_url && (
          <VideoSection>
            <VideoTitle>
              <FaPlay />
              Video bài học
            </VideoTitle>
            <VideoWrapper>
              <VideoIframe
                src={course.video_url}
                title={course.title}
                allowFullScreen
              />
            </VideoWrapper>
          </VideoSection>
        )}

        <QuizSection>
          <QuizTitle>
            <FaQuestionCircle />
            Bài kiểm tra ({quizzes.length})
          </QuizTitle>
          
          {quizzes.length > 0 ? (
            <QuizGrid>
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} to={`/quiz/${quiz.id}`}>
                  <QuizCardTitle>{quiz.title}</QuizCardTitle>
                  <QuizCardDescription>{quiz.description}</QuizCardDescription>
                  <QuizCardStats>
                    <div>
                      <FaClock style={{ marginRight: '5px' }} />
                      {quiz.time_limit} phút
                    </div>
                    <div>
                      {quiz.total_questions} câu hỏi
                    </div>
                    <StartQuizButton>
                      Làm bài
                    </StartQuizButton>
                  </QuizCardStats>
                </QuizCard>
              ))}
            </QuizGrid>
          ) : (
            <NoQuizzesMessage>
              Chưa có bài kiểm tra nào cho khóa học này.
            </NoQuizzesMessage>
          )}
        </QuizSection>
      </div>
    </CourseDetailContainer>
  );
};

export default CourseDetail;
