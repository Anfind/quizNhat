import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaPlus, FaEdit, FaTrash, FaBook, FaSave, FaTimes } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';

const CoursesContainer = styled.div`
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

const CoursesGrid = styled.div`
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
`;

const CourseCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const CourseContent = styled.div`
  padding: 25px;
`;

const CourseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const CourseInfo = styled.div`
  flex: 1;
`;

const CourseTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
`;

const CourseDescription = styled.p`
  color: #666;
  line-height: 1.5;
  margin-bottom: 15px;
`;

const CourseStats = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
`;

const StatItem = styled.div`
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
`;

const Level = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  
  ${props => props.danger ? `
    background: #f44336;
    color: white;
    &:hover { background: #d32f2f; }
  ` : `
    background: #2196F3;
    color: white;
    &:hover { background: #1976d2; }
  `}
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

const ModalTitle = styled.h3`
  color: #333;
  margin-bottom: 25px;
  font-size: 1.5rem;
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

const FormActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 10px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  ${props => props.primary ? `
    background: #667eea;
    color: white;
    &:hover { background: #5a6fd8; }
  ` : `
    background: #f5f5f5;
    color: #333;
    &:hover { background: #e0e0e0; }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, course: null, mode: 'create' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'N5',
    duration: 30,
    video_url: '',
    thumbnail: ''
  });
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/admin/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Lỗi', 'Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, course = null) => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        level: course.level,
        duration: course.duration,
        video_url: course.video_url || '',
        thumbnail: course.thumbnail || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        level: 'N5',
        duration: 30,
        video_url: '',
        thumbnail: ''
      });
    }
    setModal({ show: true, course, mode });
  };

  const closeModal = () => {
    setModal({ show: false, course: null, mode: 'create' });
    setFormData({
      title: '',
      description: '',
      level: 'N5',
      duration: 30,
      video_url: '',
      thumbnail: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.warning('Cảnh báo', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    setSaving(true);
    try {
      if (modal.mode === 'create') {
        const response = await axios.post('/api/admin/courses', formData);
        toast.success('Thành công', 'Đã tạo khóa học mới');
        fetchCourses();
      } else {
        await axios.put(`/api/admin/courses/${modal.course.id}`, formData);
        toast.success('Thành công', 'Đã cập nhật khóa học');
        fetchCourses();
      }
      closeModal();
    } catch (error) {
      console.error('Error saving course:', error);
      toast.error('Lỗi', 'Không thể lưu khóa học');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (course) => {
    if (!window.confirm(`Bạn có chắc muốn xóa khóa học "${course.title}"?`)) {
      return;
    }

    try {
      await axios.delete(`/api/admin/courses/${course.id}`);
      setCourses(courses.filter(c => c.id !== course.id));
      toast.success('Thành công', 'Đã xóa khóa học');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Lỗi', 'Không thể xóa khóa học');
    }
  };

  if (loading) {
    return (
      <CoursesContainer>
        <PageTitle>
          <FaBook />
          Course Management
        </PageTitle>
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          Đang tải danh sách khóa học...
        </div>
      </CoursesContainer>
    );
  }

  return (
    <CoursesContainer>
      <PageHeader>
        <PageTitle>
          <FaBook />
          Course Management ({courses.length} courses)
        </PageTitle>
        <AddButton onClick={() => openModal('create')}>
          <FaPlus />
          Add Course
        </AddButton>
      </PageHeader>
      
      {courses.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px', 
          color: '#666',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
        }}>
          Chưa có khóa học nào. Hãy tạo khóa học đầu tiên!
        </div>
      ) : (
        <CoursesGrid>
          {courses.map(course => (
            <CourseCard key={course.id}>
              <CourseContent>
                <CourseHeader>
                  <CourseInfo>
                    <CourseTitle>{course.title}</CourseTitle>
                    <Level>{course.level}</Level>
                  </CourseInfo>
                  <Actions>
                    <ActionButton onClick={() => openModal('edit', course)}>
                      <FaEdit />
                    </ActionButton>
                    <ActionButton danger onClick={() => handleDelete(course)}>
                      <FaTrash />
                    </ActionButton>
                  </Actions>
                </CourseHeader>
                
                <CourseDescription>{course.description}</CourseDescription>
                
                <CourseStats>
                  <StatItem>Duration: {course.duration} mins</StatItem>
                  <StatItem>Quizzes: {course.quiz_count}</StatItem>
                </CourseStats>
              </CourseContent>
            </CourseCard>
          ))}
        </CoursesGrid>
      )}
      
      {modal.show && (
        <Modal>
          <ModalContent>
            <ModalTitle>
              {modal.mode === 'create' ? 'Create New Course' : 'Edit Course'}
            </ModalTitle>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Title *</Label>
                <Input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter course title"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Description *</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Enter course description"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Level</Label>
                <Select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                >
                  <option value="N5">N5</option>
                  <option value="N4">N4</option>
                  <option value="N3">N3</option>
                  <option value="N2">N2</option>
                  <option value="N1">N1</option>
                </Select>
              </FormGroup>
              
              <FormGroup>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                  min="1"
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Video URL</Label>
                <Input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                  placeholder="https://..."
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Thumbnail URL</Label>
                <Input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                  placeholder="https://..."
                />
              </FormGroup>
              
              <FormActions>
                <Button type="button" onClick={closeModal}>
                  <FaTimes />
                  Cancel
                </Button>
                <Button type="submit" primary disabled={saving}>
                  <FaSave />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </FormActions>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </CoursesContainer>
  );
};

export default AdminCourses;
