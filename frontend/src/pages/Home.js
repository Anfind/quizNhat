import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { FaPlay, FaClock, FaBook, FaFilter, FaGraduationCap, FaStar, FaTrophy, FaUsers } from 'react-icons/fa';
import { CourseGridSkeleton } from '../components/LoadingSkeleton';

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HomeContainer = styled.div`
  padding: 40px 0;
  min-height: calc(100vh - 80px);
  position: relative;
  overflow: hidden;
`;

const ParallaxElement = styled.div`
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  animation: ${floatAnimation} 6s ease-in-out infinite;
  
  &:nth-child(1) {
    top: 10%;
    left: 10%;
    animation-delay: -2s;
  }
  
  &:nth-child(2) {
    top: 60%;
    right: 10%;
    animation-delay: -4s;
    width: 150px;
    height: 150px;
  }
  
  &:nth-child(3) {
    bottom: 20%;
    left: 5%;
    animation-delay: -1s;
    width: 80px;
    height: 80px;
  }
`;

const Hero = styled.div`
  text-align: center;
  margin-bottom: 80px;
  color: white;
  position: relative;
  z-index: 2;
  animation: ${fadeInUp} 1s ease-out;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin-bottom: 20px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, #fff, #f0f8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  animation: ${pulseAnimation} 3s ease-in-out infinite;
`;

const HeroSubtitle = styled.p`
  font-size: 1.4rem;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto 40px;
  line-height: 1.6;
  animation: ${fadeInUp} 1s ease-out 0.3s both;
`;

const HeroFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  animation: ${fadeInUp} 1s ease-out 0.6s both;
`;

const FeatureItem = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const FeatureText = styled.div`
  font-weight: 500;
`;

const FilterSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
`;

const FilterTitle = styled.h3`
  color: #333;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  padding: 12px 24px;
  border: 2px solid ${props => props.active ? '#667eea' : '#e1e5e9'};
  background: ${props => props.active ? '#667eea' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    color: ${props => props.active ? 'white' : '#667eea'};
  }
`;

const CoursesSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const SectionTitle = styled.h2`
  color: white;
  font-size: 2rem;
  margin-bottom: 30px;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
`;

const CourseCard = styled(Link)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  color: inherit;
  position: relative;
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 
      0 32px 64px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const CourseImage = styled.div`
  height: 240px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(${props => props.thumbnail}) center/cover;
    opacity: 0.2;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
  }
`;

const PlayIcon = styled.div`
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2rem;
  z-index: 2;
  transition: all 0.3s ease;
  
  ${CourseCard}:hover & {
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const CourseContent = styled.div`
  padding: 25px;
`;

const CourseLevel = styled.span`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 15px;
`;

const CourseTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
`;

const CourseDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
`;

const CourseStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
`;

const NoCoursesMessage = styled.div`
  text-align: center;
  color: white;
  font-size: 1.2rem;
  padding: 60px 20px;
`;

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('');

  const levels = [
    { value: '', label: 'Tất cả cấp độ' },
    { value: 'N5', label: 'N5 - Cơ bản' },
    { value: 'N4', label: 'N4 - Sơ cấp' },
    { value: 'N3', label: 'N3 - Trung cấp' },
    { value: 'N2', label: 'N2 - Trung cao cấp' },
    { value: 'N1', label: 'N1 - Cao cấp' }
  ];

  useEffect(() => {
    fetchCourses();
  }, [selectedLevel]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = selectedLevel ? { level: selectedLevel } : {};
      const response = await axios.get('/api/courses', { params });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HomeContainer>
      <ParallaxElement />
      <ParallaxElement />
      <ParallaxElement />
      
      <div className="container">
        <Hero className="animate-fadeInUp">
          <HeroTitle>Học Tiếng Nhật Hiệu Quả</HeroTitle>
          <HeroSubtitle>
            Khám phá hành trình học tiếng Nhật từ cơ bản đến nâng cao với các khóa học chất lượng cao
          </HeroSubtitle>
          
          <HeroFeatures>
            <FeatureItem>
              <FeatureIcon><FaTrophy /></FeatureIcon>
              <FeatureText>Học theo cấp độ JLPT</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon><FaUsers /></FeatureIcon>
              <FeatureText>Cộng đồng học tập</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon><FaStar /></FeatureIcon>
              <FeatureText>Kiểm tra tiến độ</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureIcon>🎌</FeatureIcon>
              <FeatureText>Nội dung chất lượng</FeatureText>
            </FeatureItem>
          </HeroFeatures>
        </Hero>

        <FilterSection>
          <FilterTitle>
            <FaFilter />
            Lọc theo cấp độ
          </FilterTitle>
          <FilterButtons>
            {levels.map((level) => (
              <FilterButton
                key={level.value}
                active={selectedLevel === level.value}
                onClick={() => setSelectedLevel(level.value)}
              >
                {level.label}
              </FilterButton>
            ))}
          </FilterButtons>
        </FilterSection>

        <CoursesSection>
          <SectionTitle>
            <FaBook style={{ marginRight: '15px' }} />
            Khóa học được đề xuất
          </SectionTitle>

          {loading ? (
            <CourseGridSkeleton count={6} />
          ) : courses.length > 0 ? (
            <CoursesGrid>
              {courses.map((course) => (
                <CourseCard key={course.id} to={`/course/${course.id}`}>
                  <CourseImage thumbnail={course.thumbnail}>
                    <PlayIcon>
                      <FaPlay />
                    </PlayIcon>
                  </CourseImage>
                  
                  <CourseContent>
                    <CourseLevel>{course.level}</CourseLevel>
                    <CourseTitle>{course.title}</CourseTitle>
                    <CourseDescription>{course.description}</CourseDescription>
                    
                    <CourseStats>
                      <StatItem>
                        <FaClock />
                        {course.duration} phút
                      </StatItem>
                      <StatItem>
                        <FaGraduationCap />
                        {course.level}
                      </StatItem>
                    </CourseStats>
                  </CourseContent>
                </CourseCard>
              ))}
            </CoursesGrid>
          ) : (
            <NoCoursesMessage>
              Không có khóa học nào phù hợp với bộ lọc hiện tại.
            </NoCoursesMessage>
          )}
        </CoursesSection>
      </div>
    </HomeContainer>
  );
};

export default Home;
