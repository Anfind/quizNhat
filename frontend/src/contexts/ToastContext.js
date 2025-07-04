import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaCheck, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`;

const ToastItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  animation: ${props => props.isExiting ? slideOut : slideIn} 0.3s ease;
  min-width: 300px;
  position: relative;
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: linear-gradient(135deg, #4CAF50, #45a049);
          color: white;
        `;
      case 'error':
        return `
          background: linear-gradient(135deg, #f44336, #d32f2f);
          color: white;
        `;
      case 'warning':
        return `
          background: linear-gradient(135deg, #FF9800, #f57c00);
          color: white;
        `;
      case 'info':
      default:
        return `
          background: linear-gradient(135deg, #2196F3, #1976d2);
          color: white;
        `;
    }
  }}
  
  @media (max-width: 768px) {
    min-width: unset;
    width: 100%;
  }
`;

const ToastIcon = styled.div`
  font-size: 1.2rem;
  flex-shrink: 0;
`;

const ToastContent = styled.div`
  flex: 1;
`;

const ToastTitle = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const ToastMessage = styled.div`
  font-size: 0.9rem;
  opacity: 0.95;
  line-height: 1.4;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0.8;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 0 0 12px 12px;
  width: ${props => props.progress}%;
  transition: width 0.1s linear;
`;

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const getToastIcon = (type) => {
  switch (type) {
    case 'success':
      return <FaCheck />;
    case 'error':
      return <FaTimes />;
    case 'warning':
      return <FaExclamationTriangle />;
    case 'info':
    default:
      return <FaInfoCircle />;
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(prev => 
      prev.map(toast => 
        toast.id === id ? { ...toast, isExiting: true } : toast
      )
    );
    
    // Remove from DOM after animation
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 300);
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      type,
      title,
      message,
      duration,
      progress: 100,
      isExiting: false
    };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
    
    // Progress bar animation
    let progress = 100;
    const interval = setInterval(() => {
      progress -= (100 / (duration / 100));
      if (progress <= 0) {
        clearInterval(interval);
        return;
      }
      setToasts(prev => 
        prev.map(t => 
          t.id === id ? { ...t, progress } : t
        )
      );
    }, 100);
    
    return id;
  }, [removeToast]);

  const toast = {
    success: (title, message, duration) => addToast({ type: 'success', title, message, duration }),
    error: (title, message, duration) => addToast({ type: 'error', title, message, duration }),
    warning: (title, message, duration) => addToast({ type: 'warning', title, message, duration }),
    info: (title, message, duration) => addToast({ type: 'info', title, message, duration })
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer>
        {toasts.map(toast => (
          <ToastItem 
            key={toast.id} 
            type={toast.type}
            isExiting={toast.isExiting}
          >
            <ToastIcon>
              {getToastIcon(toast.type)}
            </ToastIcon>
            <ToastContent>
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              <ToastMessage>{toast.message}</ToastMessage>
            </ToastContent>
            <CloseButton onClick={() => removeToast(toast.id)}>
              <FaTimes />
            </CloseButton>
            <ProgressBar progress={toast.progress} />
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
