import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaQuestionCircle, FaCog } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';

const QuizzesContainer = styled.div`
  max-width: 1200px;
`;

const PageHeader = styled.div`
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

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0;
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

const QuizzesTable = styled.div`
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
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr 140px;
  font-weight: 600;
  color: #333;
  
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 100px;
  }
`;

const TableRow = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr 140px;
  align-items: center;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 2fr 1fr 100px;
  }
`;

const QuizInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuizTitle = styled.span`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const CourseTitle = styled.span`
  font-size: 0.9rem;
  color: #666;
`;

const Level = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  text-align: center;
`;

const StatBadge = styled.span`
  background: ${props => props.color || '#e3f2fd'};
  color: ${props => props.textColor || '#1976d2'};
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  justify-content: center;
`;

const ActionButton = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  ${props => {
    if (props.danger) return `
      background: #f44336;
      color: white;
      &:hover { background: #d32f2f; }
    `;
    if (props.secondary) return `
      background: #FF9800;
      color: white;
      &:hover { background: #f57c00; }
    `;
    return `
      background: #2196F3;
      color: white;
      &:hover { background: #1976d2; }
    `;
  }}
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
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
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  ${props => props.primary ? `
    background: #667eea;
    color: white;
    &:hover { background: #5a6fd8; }
  ` : `
    background: #f5f5f5;
    color: #333;
    &:hover { background: #e0e0e0; }
  `}
`;

const AdminQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, quiz: null, mode: 'create' });
  const [questionsModal, setQuestionsModal] = useState({ show: false, quiz: null });
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: '',
    time_limit: 10,
    passing_score: 60
  });
  const toast = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [quizzesRes, coursesRes] = await Promise.all([
        axios.get('/api/admin/quizzes'),
        axios.get('/api/admin/courses')
      ]);
      setQuizzes(quizzesRes.data);
      setCourses(coursesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Lỗi', 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, quiz = null) => {
    if (quiz) {
      setFormData({
        title: quiz.title,
        description: quiz.description,
        course_id: quiz.course_id,
        time_limit: quiz.time_limit,
        passing_score: quiz.passing_score
      });
    } else {
      setFormData({
        title: '',
        description: '',
        course_id: '',
        time_limit: 10,
        passing_score: 60
      });
    }
    setModal({ show: true, quiz, mode });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.course_id) {
      toast.warning('Cảnh báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      if (modal.mode === 'create') {
        await axios.post('/api/admin/quizzes', formData);
        toast.success('Thành công', 'Đã tạo bài quiz mới');
      } else {
        await axios.put(`/api/admin/quizzes/${modal.quiz.id}`, formData);
        toast.success('Thành công', 'Đã cập nhật bài quiz');
      }
      setModal({ show: false, quiz: null, mode: 'create' });
      fetchData();
    } catch (error) {
      console.error('Error saving quiz:', error);
      toast.error('Lỗi', 'Không thể lưu bài quiz');
    }
  };

  const handleDelete = async (quiz) => {
    if (!window.confirm(`Bạn có chắc muốn xóa bài quiz "${quiz.title}"?`)) {
      return;
    }

    try {
      await axios.delete(`/api/admin/quizzes/${quiz.id}`);
      setQuizzes(quizzes.filter(q => q.id !== quiz.id));
      toast.success('Thành công', 'Đã xóa bài quiz');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      toast.error('Lỗi', 'Không thể xóa bài quiz');
    }
  };

  const showQuestions = (quiz) => {
    navigate(`/admin/quiz/${quiz.id}/questions`);
  };

  if (loading) {
    return (
      <QuizzesContainer>
        <PageTitle>
          <FaQuestionCircle />
          Quiz Management
        </PageTitle>
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Đang tải danh sách bài quiz...
        </div>
      </QuizzesContainer>
    );
  }

  return (
    <QuizzesContainer>
      <PageHeader>
        <PageTitle>
          <FaQuestionCircle />
          Quiz Management ({quizzes.length} quizzes)
        </PageTitle>
        <AddButton onClick={() => openModal('create')}>
          <FaPlus />
          Add Quiz
        </AddButton>
      </PageHeader>
      
      {quizzes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          Chưa có bài quiz nào. Hãy tạo bài quiz đầu tiên!
        </div>
      ) : (
        <QuizzesTable>
          <TableHeader>
            <div>Quiz Info</div>
            <div className="hidden-mobile">Course</div>
            <div className="hidden-mobile">Time</div>
            <div className="hidden-mobile">Pass Score</div>
            <div className="hidden-mobile">Questions</div>
            <div className="hidden-mobile">Attempts</div>
            <div>Actions</div>
          </TableHeader>
          
          {quizzes.map(quiz => (
            <TableRow key={quiz.id}>
              <QuizInfo>
                <QuizTitle>{quiz.title}</QuizTitle>
                <CourseTitle className="mobile-only">{quiz.course_title}</CourseTitle>
              </QuizInfo>
              <div className="hidden-mobile">{quiz.course_title}</div>
              <div className="hidden-mobile">{quiz.time_limit} mins</div>
              <div className="hidden-mobile">{quiz.passing_score}%</div>
              <StatBadge className="hidden-mobile">{quiz.question_count}</StatBadge>
              <StatBadge 
                className="hidden-mobile"
                color="#e8f5e8" 
                textColor="#2e7d32"
              >
                {quiz.attempt_count}
              </StatBadge>
              <Actions>
                <ActionButton onClick={() => showQuestions(quiz)} secondary>
                  <FaCog />
                </ActionButton>
                <ActionButton onClick={() => openModal('edit', quiz)}>
                  <FaEdit />
                </ActionButton>
                <ActionButton danger onClick={() => handleDelete(quiz)}>
                  <FaTrash />
                </ActionButton>
              </Actions>
            </TableRow>
          ))}
        </QuizzesTable>
      )}
      
      {/* Quiz Form Modal */}
      {modal.show && (
        <Modal>
          <ModalContent>
            <h3>{modal.mode === 'create' ? 'Create New Quiz' : 'Edit Quiz'}</h3>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Title *</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Description *</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Course *</Label>
                <Select
                  value={formData.course_id}
                  onChange={(e) => setFormData({...formData, course_id: e.target.value})}
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.level})
                    </option>
                  ))}
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Time Limit (minutes)</Label>
                <Input
                  type="number"
                  value={formData.time_limit}
                  onChange={(e) => setFormData({...formData, time_limit: parseInt(e.target.value)})}
                  min="1"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Passing Score (%)</Label>
                <Input
                  type="number"
                  value={formData.passing_score}
                  onChange={(e) => setFormData({...formData, passing_score: parseInt(e.target.value)})}
                  min="0"
                  max="100"
                />
              </FormGroup>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                <Button type="button" onClick={() => setModal({ show: false, quiz: null, mode: 'create' })}>
                  Cancel
                </Button>
                <Button type="submit" primary>
                  Save
                </Button>
              </div>
            </Form>
          </ModalContent>
        </Modal>
      )}
      
      {/* Questions Modal */}
      {questionsModal.show && (
        <Modal>
          <ModalContent>
            <h3>Questions for "{questionsModal.quiz?.title}"</h3>
            
            {questions.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '20px' }}>
                Chưa có câu hỏi nào. Hãy thêm câu hỏi cho bài quiz này.
              </p>
            ) : (
              <div>
                {questions.map((question, index) => (
                  <div key={question.id} style={{ 
                    padding: '15px', 
                    border: '1px solid #e0e0e0', 
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}>
                    <strong>Q{index + 1}:</strong> {question.question_text}
                    <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '5px' }}>
                      Answer: {question.correct_answer}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <Button onClick={() => setQuestionsModal({ show: false, quiz: null })}>
                Close
              </Button>
            </div>
          </ModalContent>
        </Modal>
      )}
      
      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-only { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </QuizzesContainer>
  );
};

export default AdminQuizzes;
