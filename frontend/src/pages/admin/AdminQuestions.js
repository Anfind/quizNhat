import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import AdminLayout from '../../components/AdminLayout';
import { useToast } from '../../contexts/ToastContext';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
`;

const Title = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Button = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const QuestionCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const QuestionText = styled.h3`
  color: #2c3e50;
  margin: 0;
  flex: 1;
  margin-right: 15px;
`;

const OptionsList = styled.div`
  margin: 15px 0;
`;

const Option = styled.div`
  padding: 8px 12px;
  margin: 5px 0;
  border-radius: 8px;
  background: ${props => props.isCorrect 
    ? 'linear-gradient(135deg, #a8e6cf 0%, #7fcdcd 100%)'
    : 'rgba(248, 249, 250, 0.8)'
  };
  border: 1px solid ${props => props.isCorrect ? '#28a745' : '#e9ecef'};
  color: ${props => props.isCorrect ? '#155724' : '#495057'};
  font-weight: ${props => props.isCorrect ? '600' : '400'};
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
  border-radius: 15px;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const OptionInput = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const RadioInput = styled.input`
  margin: 0;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  flex-wrap: wrap;
`;

const CancelButton = styled(Button)`
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);

  &:hover {
    box-shadow: 0 8px 25px rgba(108, 117, 125, 0.4);
  }
`;

const DeleteButton = styled(Button)`
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);

  &:hover {
    box-shadow: 0 8px 25px rgba(220, 53, 69, 0.4);
  }
`;

const LoadingSpinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AdminQuestions = () => {
  const { quizId } = useParams();
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

  useEffect(() => {
    fetchQuestions();
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
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
      }
    } catch (error) {
      console.error('Error fetching quiz:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/quiz/${quizId}/questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        showToast('Không thể tải danh sách câu hỏi', 'error');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      showToast('Lỗi khi tải danh sách câu hỏi', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question_text.trim() || !formData.option_a.trim() || 
        !formData.option_b.trim() || !formData.option_c.trim() || !formData.option_d.trim()) {
      showToast('Vui lòng điền đầy đủ thông tin', 'error');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingQuestion 
        ? `http://localhost:5000/api/admin/question/${editingQuestion.id}`
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
        showToast(
          editingQuestion ? 'Cập nhật câu hỏi thành công!' : 'Thêm câu hỏi thành công!', 
          'success'
        );
        setShowModal(false);
        setEditingQuestion(null);
        resetForm();
        fetchQuestions();
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Có lỗi xảy ra', 'error');
      }
    } catch (error) {
      console.error('Error saving question:', error);
      showToast('Lỗi khi lưu câu hỏi', 'error');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer
    });
    setShowModal(true);
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/question/${questionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        showToast('Xóa câu hỏi thành công!', 'success');
        fetchQuestions();
      } else {
        const errorData = await response.json();
        showToast(errorData.error || 'Có lỗi xảy ra khi xóa', 'error');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      showToast('Lỗi khi xóa câu hỏi', 'error');
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

  const openAddModal = () => {
    setEditingQuestion(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <AdminLayout>
      <Container>
        <Header>
          <div>
            <Title>Quản lý câu hỏi</Title>
            {quiz && <p style={{ margin: '5px 0 0 0', color: '#6c757d' }}>
              Quiz: {quiz.title}
            </p>}
          </div>
          <Button onClick={openAddModal}>
            + Thêm câu hỏi
          </Button>
        </Header>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {questions.length === 0 ? (
              <QuestionCard>
                <p style={{ textAlign: 'center', color: '#6c757d', margin: 0 }}>
                  Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên!
                </p>
              </QuestionCard>
            ) : (
              questions.map((question) => (
                <QuestionCard key={question.id}>
                  <QuestionHeader>
                    <QuestionText>{question.question_text}</QuestionText>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Button onClick={() => handleEdit(question)}>
                        Sửa
                      </Button>
                      <DeleteButton onClick={() => handleDelete(question.id)}>
                        Xóa
                      </DeleteButton>
                    </div>
                  </QuestionHeader>
                  
                  <OptionsList>
                    <Option isCorrect={question.correct_answer === 'A'}>
                      A. {question.option_a}
                    </Option>
                    <Option isCorrect={question.correct_answer === 'B'}>
                      B. {question.option_b}
                    </Option>
                    <Option isCorrect={question.correct_answer === 'C'}>
                      C. {question.option_c}
                    </Option>
                    <Option isCorrect={question.correct_answer === 'D'}>
                      D. {question.option_d}
                    </Option>
                  </OptionsList>
                </QuestionCard>
              ))
            )}
          </>
        )}

        {showModal && (
          <Modal onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
            <ModalContent>
              <h2 style={{ marginTop: 0, color: '#2c3e50' }}>
                {editingQuestion ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Câu hỏi *</Label>
                  <TextArea
                    name="question_text"
                    value={formData.question_text}
                    onChange={handleInputChange}
                    placeholder="Nhập nội dung câu hỏi..."
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Các lựa chọn *</Label>
                  
                  <OptionInput>
                    <RadioInput
                      type="radio"
                      name="correct_answer"
                      value="A"
                      checked={formData.correct_answer === 'A'}
                      onChange={handleInputChange}
                    />
                    <span>A.</span>
                    <Input
                      name="option_a"
                      value={formData.option_a}
                      onChange={handleInputChange}
                      placeholder="Lựa chọn A"
                      required
                    />
                  </OptionInput>

                  <OptionInput>
                    <RadioInput
                      type="radio"
                      name="correct_answer"
                      value="B"
                      checked={formData.correct_answer === 'B'}
                      onChange={handleInputChange}
                    />
                    <span>B.</span>
                    <Input
                      name="option_b"
                      value={formData.option_b}
                      onChange={handleInputChange}
                      placeholder="Lựa chọn B"
                      required
                    />
                  </OptionInput>

                  <OptionInput>
                    <RadioInput
                      type="radio"
                      name="correct_answer"
                      value="C"
                      checked={formData.correct_answer === 'C'}
                      onChange={handleInputChange}
                    />
                    <span>C.</span>
                    <Input
                      name="option_c"
                      value={formData.option_c}
                      onChange={handleInputChange}
                      placeholder="Lựa chọn C"
                      required
                    />
                  </OptionInput>

                  <OptionInput>
                    <RadioInput
                      type="radio"
                      name="correct_answer"
                      value="D"
                      checked={formData.correct_answer === 'D'}
                      onChange={handleInputChange}
                    />
                    <span>D.</span>
                    <Input
                      name="option_d"
                      value={formData.option_d}
                      onChange={handleInputChange}
                      placeholder="Lựa chọn D"
                      required
                    />
                  </OptionInput>

                  <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '10px' }}>
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
    </AdminLayout>
  );
};

export default AdminQuestions;
