import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaTrash, FaUsers } from 'react-icons/fa';
import { useToast } from '../../contexts/ToastContext';

const UsersContainer = styled.div`
  max-width: 1200px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 15px;
`;

const UsersTable = styled.div`
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
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 120px;
  font-weight: 600;
  color: #333;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 80px;
    gap: 10px;
  }
`;

const TableRow = styled.div`
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 120px;
  align-items: center;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 80px;
    gap: 10px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
`;

const UserEmail = styled.span`
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

const QuizCount = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
`;

const Date = styled.span`
  color: #666;
  font-size: 0.9rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
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
    &:hover {
      background: #d32f2f;
    }
  ` : `
    background: #2196F3;
    color: white;
    &:hover {
      background: #1976d2;
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  text-align: center;
`;

const ModalTitle = styled.h3`
  color: #333;
  margin-bottom: 15px;
`;

const ModalText = styled.p`
  color: #666;
  margin-bottom: 25px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  ${props => props.primary ? `
    background: #667eea;
    color: white;
    &:hover {
      background: #5a6fd8;
    }
  ` : `
    background: #f5f5f5;
    color: #333;
    &:hover {
      background: #e0e0e0;
    }
  `}
`;

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Lỗi', 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    
    setDeleting(true);
    try {
      await axios.delete(`/api/admin/users/${deleteModal.user.id}`);
      setUsers(users.filter(u => u.id !== deleteModal.user.id));
      toast.success('Thành công', 'Đã xóa người dùng');
      setDeleteModal({ show: false, user: null });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Lỗi', 'Không thể xóa người dùng');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <UsersContainer>
        <PageTitle>
          <FaUsers />
          User Management
        </PageTitle>
        <LoadingMessage>Đang tải danh sách người dùng...</LoadingMessage>
      </UsersContainer>
    );
  }

  return (
    <UsersContainer>
      <PageTitle>
        <FaUsers />
        User Management ({users.length} users)
      </PageTitle>
      
      {users.length === 0 ? (
        <EmptyMessage>Chưa có người dùng nào</EmptyMessage>
      ) : (
        <UsersTable>
          <TableHeader>
            <div>User Info</div>
            <div>Email</div>
            <div className="hidden-mobile">Level</div>
            <div className="hidden-mobile">Quizzes</div>
            <div className="hidden-mobile">Joined</div>
            <div>Actions</div>
          </TableHeader>
          
          {users.map(user => (
            <TableRow key={user.id}>
              <UserInfo>
                <UserName>{user.username}</UserName>
                <UserEmail className="mobile-only">{user.email}</UserEmail>
              </UserInfo>
              <UserEmail className="hidden-mobile">{user.email}</UserEmail>
              <Level className="hidden-mobile">{user.level}</Level>
              <QuizCount className="hidden-mobile">{user.total_quizzes}</QuizCount>
              <Date className="hidden-mobile">{formatDate(user.created_at)}</Date>
              <Actions>
                <ActionButton
                  onClick={() => setDeleteModal({ show: true, user })}
                  danger
                  disabled={user.username === 'admin'}
                  title={user.username === 'admin' ? 'Cannot delete admin' : 'Delete user'}
                >
                  <FaTrash />
                </ActionButton>
              </Actions>
            </TableRow>
          ))}
        </UsersTable>
      )}
      
      {deleteModal.show && (
        <Modal>
          <ModalContent>
            <ModalTitle>Confirm Delete</ModalTitle>
            <ModalText>
              Are you sure you want to delete user "{deleteModal.user?.username}"? 
              This will also delete all their quiz results and progress.
            </ModalText>
            <ModalActions>
              <Button onClick={() => setDeleteModal({ show: false, user: null })}>
                Cancel
              </Button>
              <Button 
                primary 
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </Button>
            </ModalActions>
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
    </UsersContainer>
  );
};

export default AdminUsers;
