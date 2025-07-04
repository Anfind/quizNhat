-- Database cho hệ thống học tập tiếng Nhật
CREATE DATABASE IF NOT EXISTS quiz_nhat_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE quiz_nhat_db;

-- Bảng users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    level ENUM('N5', 'N4', 'N3', 'N2', 'N1') DEFAULT 'N5',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng courses (khóa học)
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    level ENUM('N5', 'N4', 'N3', 'N2', 'N1') NOT NULL,
    video_url VARCHAR(500),
    thumbnail VARCHAR(500),
    duration INT DEFAULT 0, -- phút
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng quizzes (bài thi)
CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    time_limit INT DEFAULT 30, -- phút
    total_questions INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Bảng questions (câu hỏi)
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'true_false', 'fill_blank') DEFAULT 'multiple_choice',
    correct_answer VARCHAR(500) NOT NULL,
    option_a VARCHAR(200),
    option_b VARCHAR(200),
    option_c VARCHAR(200),
    option_d VARCHAR(200),
    explanation TEXT,
    points INT DEFAULT 1,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Bảng quiz_results (kết quả thi)
CREATE TABLE quiz_results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    quiz_id INT,
    score DECIMAL(5,2) DEFAULT 0,
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    time_taken INT DEFAULT 0, -- giây
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Bảng user_answers (câu trả lời của user)
CREATE TABLE user_answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    result_id INT,
    question_id INT,
    user_answer VARCHAR(500),
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (result_id) REFERENCES quiz_results(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Bảng user_progress (tiến độ học tập)
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    course_id INT,
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_course (user_id, course_id)
);

-- Dữ liệu mẫu
INSERT INTO courses (title, description, level, video_url, thumbnail, duration) VALUES
('Hiragana Cơ Bản', 'Học bảng chữ cái Hiragana từ A-Z', 'N5', 'https://www.youtube.com/embed/6p9Il_j0zjc', '/images/hiragana.jpg', 45),
('Katakana Cơ Bản', 'Học bảng chữ cái Katakana cho người mới bắt đầu', 'N5', 'https://www.youtube.com/embed/s6DKRgtVLGA', '/images/katakana.jpg', 40),
('Từ Vựng N5', 'Học 800 từ vựng cơ bản N5', 'N5', 'https://www.youtube.com/embed/wD3FJgij79c', '/images/vocab-n5.jpg', 60),
('Ngữ Pháp N4', 'Ngữ pháp trung cấp cho N4', 'N4', 'https://www.youtube.com/embed/YxIjsR9_d0Q', '/images/grammar-n4.jpg', 90),
('Kanji N3', 'Học Kanji trình độ N3', 'N3', 'https://www.youtube.com/embed/CF1DmjbzJyo', '/images/kanji-n3.jpg', 120);

INSERT INTO quizzes (course_id, title, description, time_limit, total_questions) VALUES
(1, 'Kiểm tra Hiragana', 'Bài kiểm tra kiến thức Hiragana cơ bản', 15, 10),
(2, 'Kiểm tra Katakana', 'Bài kiểm tra kiến thức Katakana', 15, 10),
(3, 'Từ vựng N5 - Phần 1', 'Kiểm tra 50 từ vựng N5 cơ bản', 20, 15),
(4, 'Ngữ pháp N4 - Bài 1', 'Kiểm tra ngữ pháp N4', 25, 12),
(5, 'Kanji N3 - Cơ bản', 'Kiểm tra Kanji N3', 30, 20);

INSERT INTO questions (quiz_id, question_text, question_type, correct_answer, option_a, option_b, option_c, option_d, explanation) VALUES
(1, 'Chữ あ đọc như thế nào?', 'multiple_choice', 'a', 'a', 'i', 'u', 'e', 'あ được đọc là "a"'),
(1, 'Chữ か đọc như thế nào?', 'multiple_choice', 'ka', 'ka', 'ga', 'sa', 'ta', 'か được đọc là "ka"'),
(1, 'Chữ さ đọc như thế nào?', 'multiple_choice', 'sa', 'sa', 'ta', 'na', 'ha', 'さ được đọc là "sa"'),
(1, 'Chữ た đọc như thế nào?', 'multiple_choice', 'ta', 'ta', 'da', 'na', 'ha', 'た được đọc là "ta"'),
(1, 'Chữ な đọc như thế nào?', 'multiple_choice', 'na', 'na', 'ha', 'ma', 'ya', 'な được đọc là "na"'),

(2, 'Chữ ア đọc như thế nào?', 'multiple_choice', 'a', 'a', 'i', 'u', 'e', 'ア được đọc là "a"'),
(2, 'Chữ カ đọc như thế nào?', 'multiple_choice', 'ka', 'ka', 'ga', 'sa', 'ta', 'カ được đọc là "ka"'),
(2, 'Chữ サ đọc như thế nào?', 'multiple_choice', 'sa', 'sa', 'ta', 'na', 'ha', 'サ được đọc là "sa"'),

(3, 'こんにちは nghĩa là gì?', 'multiple_choice', 'Xin chào', 'Xin chào', 'Tạm biệt', 'Cảm ơn', 'Xin lỗi', 'こんにちは nghĩa là xin chào'),
(3, 'ありがとう nghĩa là gì?', 'multiple_choice', 'Cảm ơn', 'Cảm ơn', 'Xin lỗi', 'Xin chào', 'Tạm biệt', 'ありがとう nghĩa là cảm ơn'),
(3, 'すみません nghĩa là gì?', 'multiple_choice', 'Xin lỗi', 'Xin lỗi', 'Cảm ơn', 'Xin chào', 'Tạm biệt', 'すみません nghĩa là xin lỗi');
