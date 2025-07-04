import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaClock, FaQuestionCircle, FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { useToast } from '../contexts/ToastContext';

const QuizContainer = styled.div`
  padding: 40px 0;
  min-height: calc(100vh - 80px);
`;

const QuizCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
`;

const QuizHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
`;

const QuizTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
`;

const QuizInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 1rem;
  
  svg {
    color: #667eea;
  }
`;

const Timer = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 25px;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 30px;
`;

const ProgressBar = styled.div`
  background: #f0f0f0;
  height: 8px;
  border-radius: 4px;
  margin-bottom: 30px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  height: 100%;
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

const QuestionSection = styled.div`
  margin-bottom: 30px;
`;

const QuestionNumber = styled.div`
  color: #667eea;
  font-weight: 600;
  margin-bottom: 10px;
`;

const QuestionText = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 25px;
  line-height: 1.5;
`;

const OptionsGrid = styled.div`
  display: grid;
  gap: 15px;
`;

const OptionButton = styled.button`
  background: ${props => props.selected ? '#667eea' : 'white'};
  color: ${props => props.selected ? 'white' : '#333'};
  border: 2px solid ${props => props.selected ? '#667eea' : '#e1e5e9'};
  padding: 20px;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const NavButton = styled.button`
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PrevButton = styled(NavButton)`
  background: #f8f9fa;
  color: #666;
  
  &:hover:not(:disabled) {
    background: #e9ecef;
    transform: translateY(-2px);
  }
`;

const NextButton = styled(NavButton)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const SubmitButton = styled(NavButton)`
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(76, 175, 80, 0.3);
  }
`;

const ResultModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ResultContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 90%;
  text-align: center;
`;

const ResultIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
  color: ${props => props.passed ? '#4CAF50' : '#f44336'};
`;

const ResultTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 15px;
`;

const ResultScore = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.passed ? '#4CAF50' : '#f44336'};
  margin-bottom: 20px;
`;

const ResultStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
`;

const StatLabel = styled.div`
  color: #666;
  margin-top: 5px;
`;

const ResultButtons = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const BackButton = styled.button`
  background: #f8f9fa;
  color: #666;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  
  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
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

const Quiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime] = useState(Date.now());

  const fetchQuiz = useCallback(async () => {
    try {
      const response = await axios.get(`/api/quizzes/${id}`);
      const quizData = response.data;
      setQuiz(quizData);
      setTimeLeft(quizData.time_limit * 60); // Convert minutes to seconds
      setLoading(false);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      setLoading(false);
      toast.error('Lỗi tải dữ liệu', 'Không thể tải thông tin bài quiz');
    }
  }, [id, toast]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    
    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    
    try {
      const response = await axios.post(`/api/quizzes/${id}/submit`, {
        answers,
        time_taken: timeTaken
      });
      
      setResult(response.data);
      setShowResult(true);
      toast.success('Nộp bài thành công', 'Kết quả của bạn đã được lưu lại');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Lỗi nộp bài', 'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  }, [submitting, startTime, id, answers, toast]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft, quiz, handleSubmit]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleViewResults = () => {
    navigate('/results');
  };

  const handleRetakeQuiz = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(quiz.time_limit * 60);
  };

  if (loading) {
    return (
      <QuizContainer>
        <div className="container">
          <LoadingSpinner>
            <div className="spinner"></div>
          </LoadingSpinner>
        </div>
      </QuizContainer>
    );
  }

  if (!quiz || quiz.questions.length === 0) {
    return (
      <QuizContainer>
        <div className="container">
          <QuizCard>
            <div style={{ textAlign: 'center', color: '#666' }}>
              Bài quiz không tồn tại hoặc chưa có câu hỏi nào.
            </div>
          </QuizCard>
        </div>
      </QuizContainer>
    );
  }

  const currentQuestionData = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <QuizContainer>
      <div className="container">
        <BackButton onClick={() => navigate(-1)}>
          <FaArrowLeft />
          Quay lại
        </BackButton>

        <QuizCard>
          <QuizHeader>
            <QuizTitle>{quiz.title}</QuizTitle>
            <QuizInfo>
              <InfoItem>
                <FaQuestionCircle />
                {quiz.questions.length} câu hỏi
              </InfoItem>
              <InfoItem>
                <FaClock />
                {quiz.time_limit} phút
              </InfoItem>
            </QuizInfo>
            <Timer>
              Thời gian còn lại: {formatTime(timeLeft)}
            </Timer>
          </QuizHeader>

          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>

          <QuestionSection>
            <QuestionNumber>
              Câu hỏi {currentQuestion + 1}/{quiz.questions.length}
            </QuestionNumber>
            <QuestionText>{currentQuestionData.question_text}</QuestionText>

            <OptionsGrid>
              {['option_a', 'option_b', 'option_c', 'option_d'].map((optionKey) => {
                const optionValue = currentQuestionData[optionKey];
                if (!optionValue) return null;
                
                return (
                  <OptionButton
                    key={optionKey}
                    selected={answers[currentQuestionData.id] === optionValue}
                    onClick={() => handleAnswerSelect(currentQuestionData.id, optionValue)}
                  >
                    {optionValue}
                  </OptionButton>
                );
              })}
            </OptionsGrid>
          </QuestionSection>

          <NavigationButtons>
            <PrevButton
              onClick={handlePrev}
              disabled={currentQuestion === 0}
            >
              Câu trước
            </PrevButton>

            {currentQuestion === quiz.questions.length - 1 ? (
              <SubmitButton
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
              </SubmitButton>
            ) : (
              <NextButton onClick={handleNext}>
                Câu tiếp theo
              </NextButton>
            )}
          </NavigationButtons>
        </QuizCard>

        {showResult && result && (
          <ResultModal>
            <ResultContent>
              <ResultIcon passed={result.passed}>
                {result.passed ? <FaCheck /> : <FaTimes />}
              </ResultIcon>
              <ResultTitle>
                {result.passed ? 'Chúc mừng!' : 'Cần cố gắng thêm!'}
              </ResultTitle>
              <ResultScore passed={result.passed}>
                {Number(result.score).toFixed(1)}%
              </ResultScore>
              
              <ResultStats>
                <StatCard>
                  <StatNumber>{result.correct_answers}</StatNumber>
                  <StatLabel>Câu đúng</StatLabel>
                </StatCard>
                <StatCard>
                  <StatNumber>{result.total_questions}</StatNumber>
                  <StatLabel>Tổng số câu</StatLabel>
                </StatCard>
              </ResultStats>

              <ResultButtons>
                <NextButton onClick={handleViewResults}>
                  Xem chi tiết
                </NextButton>
                <PrevButton onClick={handleRetakeQuiz}>
                  Làm lại
                </PrevButton>
              </ResultButtons>
            </ResultContent>
          </ResultModal>
        )}
      </div>
    </QuizContainer>
  );
};

export default Quiz;
