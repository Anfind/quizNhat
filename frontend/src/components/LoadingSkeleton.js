import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -468px 0;
  }
  100% {
    background-position: 468px 0;
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 400% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
  border-radius: 8px;
`;

const SkeletonCard = styled(SkeletonBase)`
  height: 300px;
  border-radius: 16px;
  margin-bottom: 20px;
`;

const SkeletonTitle = styled(SkeletonBase)`
  height: 24px;
  width: 80%;
  margin-bottom: 12px;
`;

const SkeletonText = styled(SkeletonBase)`
  height: 16px;
  width: ${props => props.width || '100%'};
  margin-bottom: 8px;
`;

const SkeletonButton = styled(SkeletonBase)`
  height: 40px;
  width: 120px;
  border-radius: 8px;
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const SkeletonCardWrapper = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

// Course Card Skeleton
export const CourseCardSkeleton = () => (
  <SkeletonCardWrapper>
    <SkeletonCard />
    <SkeletonTitle />
    <SkeletonText width="60%" />
    <SkeletonText width="40%" />
    <div style={{ marginTop: '15px' }}>
      <SkeletonButton />
    </div>
  </SkeletonCardWrapper>
);

// Course Grid Skeleton
export const CourseGridSkeleton = ({ count = 6 }) => (
  <SkeletonGrid>
    {Array.from({ length: count }).map((_, index) => (
      <CourseCardSkeleton key={index} />
    ))}
  </SkeletonGrid>
);

// Quiz Card Skeleton
export const QuizCardSkeleton = () => (
  <SkeletonCardWrapper>
    <SkeletonTitle />
    <SkeletonText />
    <SkeletonText width="70%" />
    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
      <SkeletonText width="30%" />
      <SkeletonButton />
    </div>
  </SkeletonCardWrapper>
);

// Results Card Skeleton
export const ResultCardSkeleton = () => (
  <SkeletonCardWrapper>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
      <div style={{ flex: 1 }}>
        <SkeletonTitle />
        <SkeletonText width="50%" />
      </div>
      <SkeletonText width="60px" />
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
      <SkeletonText width="80%" />
      <SkeletonText width="80%" />
      <SkeletonText width="80%" />
    </div>
    <div style={{ display: 'flex', gap: '10px' }}>
      <SkeletonButton />
      <SkeletonButton />
    </div>
  </SkeletonCardWrapper>
);

// Profile Skeleton
export const ProfileSkeleton = () => (
  <SkeletonCardWrapper>
    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
      <SkeletonBase 
        style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          margin: '0 auto 20px' 
        }} 
      />
      <SkeletonTitle style={{ margin: '0 auto 10px', width: '200px' }} />
      <SkeletonText width="100px" style={{ margin: '0 auto' }} />
    </div>
    
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} style={{ marginBottom: '20px' }}>
        <SkeletonText width="30%" />
        <SkeletonText width="60%" />
      </div>
    ))}
  </SkeletonCardWrapper>
);

// Generic List Skeleton
export const ListSkeleton = ({ count = 3, height = '60px' }) => (
  <div>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonBase 
        key={index} 
        style={{ 
          height, 
          marginBottom: '15px',
          borderRadius: '8px'
        }} 
      />
    ))}
  </div>
);

const Skeletons = {
  CourseCardSkeleton,
  CourseGridSkeleton,
  QuizCardSkeleton,
  ResultCardSkeleton,
  ProfileSkeleton,
  ListSkeleton
};

export default Skeletons;
