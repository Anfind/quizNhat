import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaBook, 
  FaQuestionCircle, 
  FaChartBar,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';

const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: #f8f9fa;
`;

const Sidebar = styled.aside`
  width: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 0;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
`;

const SidebarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const SidebarNav = styled.nav`
  padding: 0 10px;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 5px;
  transition: all 0.3s ease;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 15px;
  background: none;
  border: none;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  margin: 10px 10px 0;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 20px;
  
  @media (max-width: 768px) {
    margin-left: 200px;
    padding: 15px;
  }
`;

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user || user.username !== 'admin') {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '1.5rem'
      }}>
        Access Denied - Admin Only
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <AdminContainer>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>Admin Panel</SidebarTitle>
        </SidebarHeader>
        
        <SidebarNav>
          <NavItem to="/admin" $active={isActive('/admin')}>
            <FaTachometerAlt />
            Dashboard
          </NavItem>
          
          <NavItem to="/admin/users" $active={isActive('/admin/users')}>
            <FaUsers />
            Users
          </NavItem>
          
          <NavItem to="/admin/courses" $active={isActive('/admin/courses')}>
            <FaBook />
            Courses
          </NavItem>
          
          <NavItem to="/admin/quizzes" $active={isActive('/admin/quizzes')}>
            <FaQuestionCircle />
            Quizzes
          </NavItem>
          
          <NavItem to="/admin/stats" $active={isActive('/admin/stats')}>
            <FaChartBar />
            Statistics
          </NavItem>
          
          <hr style={{ 
            border: 'none', 
            borderTop: '1px solid rgba(255, 255, 255, 0.2)', 
            margin: '15px 15px' 
          }} />
          
          <NavItem to="/">
            <FaHome />
            Back to Site
          </NavItem>
          
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt />
            Logout
          </LogoutButton>
        </SidebarNav>
      </Sidebar>
      
      <MainContent>
        <Outlet />
      </MainContent>
    </AdminContainer>
  );
};

export default AdminLayout;
