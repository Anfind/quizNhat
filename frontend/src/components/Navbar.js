import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { FaHome, FaUser, FaChartLine, FaSignOutAlt, FaGraduationCap, FaBars, FaTimes, FaCog } from 'react-icons/fa';

const NavbarContainer = styled.nav`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const NavContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 0 15px;
  }
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    color: #f0f0f0;
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: ${props => props.isOpen ? '0' : '-100%'};
    height: 100vh;
    width: 280px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 80px;
    transition: right 0.3s ease;
    box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
  }
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: white;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 80%;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 15px 30px;
    margin-bottom: 10px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 80%;
    justify-content: center;
    margin-top: 20px;
  }
`;

const UserInfo = styled.span`
  color: white;
  font-weight: 500;
  margin-right: 1rem;
  font-size: 0.9rem;
  
  @media (max-width: 768px) {
    margin: 0 0 20px 0;
    text-align: center;
    padding: 0 30px;
  }
`;

const Overlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <NavbarContainer>
        <NavContent>
          <Logo to="/" onClick={handleLinkClick}>
            <FaGraduationCap />
            Quiz Nhat
          </Logo>
          
          <MobileMenuButton onClick={handleMenuToggle}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>
          
          <NavLinks isOpen={isMenuOpen}>
            <CloseButton onClick={handleMenuToggle}>
              <FaTimes />
            </CloseButton>
            
            <NavLink to="/" onClick={handleLinkClick}>
              <FaHome />
              Trang chủ
            </NavLink>
            
            <NavLink to="/results" onClick={handleLinkClick}>
              <FaChartLine />
              Kết quả
            </NavLink>
            
            <NavLink to="/profile" onClick={handleLinkClick}>
              <FaUser />
              Hồ sơ
            </NavLink>
            
            {user.role === 'admin' && (
              <NavLink to="/admin" onClick={handleLinkClick}>
                <FaCog />
                Quản trị
              </NavLink>
            )}
            
            <UserInfo>
              Xin chào, {user.full_name || user.username}!
            </UserInfo>
            
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt />
              Đăng xuất
            </LogoutButton>
          </NavLinks>
        </NavContent>
      </NavbarContainer>
      
      <Overlay isOpen={isMenuOpen} onClick={handleMenuToggle} />
    </>
  );
};

export default Navbar;
