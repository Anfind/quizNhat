import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const BackButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a6268;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const QuizInfo = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  h3 {
    margin: 0 0 5px 0;
    color: #495057;
  }
  
  p {
    margin: 0;
    color: #6c757d;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const QuestionsTable = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  background: #f8f9fa;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  display: grid;
  grid-template-columns: 1fr 150px 120px;
  font-weight: 600;
  color: #333;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const TableRow = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: grid;
  grid-template-columns: 1fr 150px 120px;
  align-items: start;
  gap: 15px;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const QuestionContent = styled.div`
  h4 {
    margin: 0 0 10px 0;
    color: #333;
    line-height: 1.4;
  }
  
  .options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-top: 10px;
  }
  
  .option {
    padding: 8px 12px;
    background: #f8f9fa;
    border-radius: 4px;
    border-left: 3px solid #dee2e6;
    font-size: 0.9rem;
    
    &.correct {
      background: #d4edda;
      border-left-color: #28a745;
      font-weight: 500;
    }
  }
`;

const CorrectAnswer = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 500;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  
  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const ActionButton = styled.button`
  background: ${props => props.variant === 'danger' ? '#dc3545' : '#667eea'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  
  h2 {
    margin: 0;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 100px;
  }
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OptionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: ${props => props.isCorrect ? '#d4edda' : 'white'};
  
  input[type="radio"] {
    width: auto;
    margin: 0;
  }
  
  input[type="text"] {
    flex: 1;
    margin: 0;
    border: none;
    background: transparent;
    
    &:focus {
      box-shadow: none;
    }
  }
  
  label {
    margin: 0;
    font-weight: 600;
    color: #495057;
    min-width: 20px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: #5a6268;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 50px 20px;
  color: #666;
  
  .icon {
    font-size: 3rem;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  h3 {
    margin: 0 0 10px 0;
    color: #333;
  }
  
  p {
    margin: 0;
    font-size: 1.1rem;
  }
`;

const AdminQuestions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [questions, setQuestions] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A'
  });

  const fetchQuiz = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/quiz/${quizId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuiz(data);
      } else {
        showToast('error', 'Không thể tải thông tin quiz');
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
      showToast('error', 'Lỗi kết nối khi tải thông tin quiz');
    }
  }, [quizId, showToast]);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/quizzes/${quizId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        showToast('error', 'Không thể tải danh sách câu hỏi');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      showToast('error', 'Lỗi kết nối khi tải câu hỏi');
    } finally {
      setLoading(false);
    }
  }, [quizId, showToast]);

  useEffect(() => {
    fetchQuiz();
    fetchQuestions();
  }, [fetchQuiz, fetchQuestions]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question_text.trim()) {
      showToast('error', 'Vui lòng nhập nội dung câu hỏi');
      return;
    }
    
    if (!formData.option_a.trim() || !formData.option_b.trim()) {
      showToast('error', 'Vui lòng nhập ít nhất 2 đáp án A và B');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingQuestion 
        ? `http://localhost:5000/api/admin/questions/${editingQuestion.id}`
        : `http://localhost:5000/api/admin/quiz/${quizId}/questions`;
      
      const method = editingQuestion ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showToast('success', editingQuestion ? 'Cập nhật câu hỏi thành công' : 'Thêm câu hỏi thành công');
        setShowModal(false);
        setEditingQuestion(null);
        resetForm();
        fetchQuestions();
      } else {
        const errorData = await response.json();
        showToast('error', errorData.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      showToast('error', 'Lỗi kết nối khi lưu câu hỏi');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c || '',
      option_d: question.option_d || '',
      correct_answer: question.correct_answer
    });
    setShowModal(true);
  };

  const handleDelete = async (questionId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/admin/questions/${questionId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          showToast('success', 'Xóa câu hỏi thành công');
          fetchQuestions();
        } else {
          showToast('error', 'Không thể xóa câu hỏi');
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        showToast('error', 'Lỗi kết nối khi xóa câu hỏi');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'A'
    });
  };

  const handleAddNew = () => {
    setEditingQuestion(null);
    resetForm();
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getOptionLetter = (answer) => {
    const map = { A: 'A', B: 'B', C: 'C', D: 'D' };
    return map[answer] || answer;
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <div className="spinner"></div>
        </LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton onClick={() => navigate('/admin/quizzes')}>
            <FaArrowLeft /> Quay lại
          </BackButton>
          <Title>Quản lý câu hỏi</Title>
        </HeaderLeft>
        <AddButton onClick={handleAddNew}>
          <FaPlus /> Thêm câu hỏi
        </AddButton>
      </Header>

      {quiz && (
        <QuizInfo>
          <h3>{quiz.title}</h3>
          <p>Khóa học: {quiz.course_title} | Tổng câu hỏi: {questions.length}</p>
        </QuizInfo>
      )}

      <QuestionsTable>
        <TableHeader>
          <div>Câu hỏi</div>
          <div>Đáp án đúng</div>
          <div>Thao tác</div>
        </TableHeader>

        {questions.length === 0 ? (
          <EmptyState>
            <div className="icon">❓</div>
            <h3>Chưa có câu hỏi nào</h3>
            <p>Hãy thêm câu hỏi đầu tiên cho quiz này</p>
          </EmptyState>
        ) : (
          questions.map((question) => (
            <TableRow key={question.id}>
              <QuestionContent>
                <h4>{question.question_text}</h4>
                <div className="options">
                  <div className={`option ${question.correct_answer === 'A' ? 'correct' : ''}`}>
                    A. {question.option_a}
                  </div>
                  <div className={`option ${question.correct_answer === 'B' ? 'correct' : ''}`}>
                    B. {question.option_b}
                  </div>
                  {question.option_c && (
                    <div className={`option ${question.correct_answer === 'C' ? 'correct' : ''}`}>
                      C. {question.option_c}
                    </div>
                  )}
                  {question.option_d && (
                    <div className={`option ${question.correct_answer === 'D' ? 'correct' : ''}`}>
                      D. {question.option_d}
                    </div>
                  )}
                </div>
              </QuestionContent>
              
              <CorrectAnswer>
                Đáp án {getOptionLetter(question.correct_answer)}
              </CorrectAnswer>
              
              <ActionButtons>
                <ActionButton onClick={() => handleEdit(question)}>
                  <FaEdit />
                </ActionButton>
                <ActionButton 
                  variant="danger" 
                  onClick={() => handleDelete(question.id)}
                >
                  <FaTrash />
                </ActionButton>
              </ActionButtons>
            </TableRow>
          ))
        )}
      </QuestionsTable>

      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <h2>{editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h2>
              <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            </ModalHeader>

            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Nội dung câu hỏi *</label>
                <textarea
                  name="question_text"
                  value={formData.question_text}
                  onChange={handleInputChange}
                  placeholder="Nhập nội dung câu hỏi..."
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Các đáp án *</label>
                <OptionsGrid>
                  <OptionGroup isCorrect={formData.correct_answer === 'A'}>
                    <input
                      type="radio"
                      name="correct_answer"
                      value="A"
                      checked={formData.correct_answer === 'A'}
                      onChange={handleInputChange}
                    />
                    <label>A:</label>
                    <input
                      type="text"
                      name="option_a"
                      value={formData.option_a}
                      onChange={handleInputChange}
                      placeholder="Đáp án A"
                      required
                    />
                  </OptionGroup>

                  <OptionGroup isCorrect={formData.correct_answer === 'B'}>
                    <input
                      type="radio"
                      name="correct_answer"
                      value="B"
                      checked={formData.correct_answer === 'B'}
                      onChange={handleInputChange}
                    />
                    <label>B:</label>
                    <input
                      type="text"
                      name="option_b"
                      value={formData.option_b}
                      onChange={handleInputChange}
                      placeholder="Đáp án B"
                      required
                    />
                  </OptionGroup>

                  <OptionGroup isCorrect={formData.correct_answer === 'C'}>
                    <input
                      type="radio"
                      name="correct_answer"
                      value="C"
                      checked={formData.correct_answer === 'C'}
                      onChange={handleInputChange}
                    />
                    <label>C:</label>
                    <input
                      type="text"
                      name="option_c"
                      value={formData.option_c}
                      onChange={handleInputChange}
                      placeholder="Đáp án C (tùy chọn)"
                    />
                  </OptionGroup>

                  <OptionGroup isCorrect={formData.correct_answer === 'D'}>
                    <input
                      type="radio"
                      name="correct_answer"
                      value="D"
                      checked={formData.correct_answer === 'D'}
                      onChange={handleInputChange}
                    />
                    <label>D:</label>
                    <input
                      type="text"
                      name="option_d"
                      value={formData.option_d}
                      onChange={handleInputChange}
                      placeholder="Đáp án D (tùy chọn)"
                    />
                  </OptionGroup>
                </OptionsGrid>
                <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>
                  * Chọn radio button để đánh dấu đáp án đúng
                </p>
              </FormGroup>

              <ModalActions>
                <CancelButton type="button" onClick={() => setShowModal(false)}>
                  Hủy
                </CancelButton>
                <Button type="submit">
                  {editingQuestion ? 'Cập nhật' : 'Thêm câu hỏi'}
                </Button>
              </ModalActions>
            </form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default AdminQuestions;
