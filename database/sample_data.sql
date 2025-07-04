-- Tạo user demo để test
INSERT INTO users (username, email, password, full_name, level) VALUES
('demo', 'demo@quiznhat.com', '123456', 'Demo User', 'N5'),
('admin', 'admin@quiznhat.com', 'admin123', 'Admin User', 'N1');

-- Thêm câu hỏi cho quiz hiragana
INSERT INTO questions (quiz_id, question_text, question_type, correct_answer, option_a, option_b, option_c, option_d, explanation) VALUES
(1, 'Chữ は đọc như thế nào?', 'multiple_choice', 'ha', 'ha', 'wa', 'pa', 'ba', 'は được đọc là "ha"'),
(1, 'Chữ を đọc như thế nào?', 'multiple_choice', 'wo', 'wo', 'o', 'no', 'ro', 'を được đọc là "wo"'),
(1, 'Chữ ん đọc như thế nào?', 'multiple_choice', 'n', 'n', 'm', 'ng', 'nn', 'ん được đọc là "n"'),
(1, 'Chữ り đọc như thế nào?', 'multiple_choice', 'ri', 'ri', 'ru', 'ra', 're', 'り được đọc là "ri"'),
(1, 'Chữ め đọc như thế nào?', 'multiple_choice', 'me', 'me', 'ma', 'mo', 'mu', 'め được đọc là "me"');

-- Thêm câu hỏi cho quiz katakana
INSERT INTO questions (quiz_id, question_text, question_type, correct_answer, option_a, option_b, option_c, option_d, explanation) VALUES
(2, 'Chữ タ đọc như thế nào?', 'multiple_choice', 'ta', 'ta', 'da', 'na', 'ha', 'タ được đọc là "ta"'),
(2, 'Chữ ナ đọc như thế nào?', 'multiple_choice', 'na', 'na', 'ha', 'ma', 'ya', 'ナ được đọc là "na"'),
(2, 'Chữ ハ đọc như thế nào?', 'multiple_choice', 'ha', 'ha', 'wa', 'pa', 'ba', 'ハ được đọc là "ha"'),
(2, 'Chữ マ đọc như thế nào?', 'multiple_choice', 'ma', 'ma', 'na', 'wa', 'ya', 'マ được đọc là "ma"'),
(2, 'Chữ ヤ đọc như thế nào?', 'multiple_choice', 'ya', 'ya', 'wa', 'ra', 'na', 'ヤ được đọc là "ya"'),
(2, 'Chữ ラ đọc như thế nào?', 'multiple_choice', 'ra', 'ra', 'la', 'na', 'wa', 'ラ được đọc là "ra"'),
(2, 'Chữ ワ đọc như thế nào?', 'multiple_choice', 'wa', 'wa', 'ra', 'na', 'ya', 'ワ được đọc là "wa"');

-- Thêm câu hỏi cho quiz từ vựng N5
INSERT INTO questions (quiz_id, question_text, question_type, correct_answer, option_a, option_b, option_c, option_d, explanation) VALUES
(3, 'さようなら nghĩa là gì?', 'multiple_choice', 'Tạm biệt', 'Tạm biệt', 'Xin chào', 'Cảm ơn', 'Xin lỗi', 'さようなら nghĩa là tạm biệt'),
(3, 'はい nghĩa là gì?', 'multiple_choice', 'Vâng/Có', 'Vâng/Có', 'Không', 'Có lẽ', 'Chắc chắn', 'はい nghĩa là vâng/có'),
(3, 'いいえ nghĩa là gì?', 'multiple_choice', 'Không', 'Không', 'Có', 'Có lẽ', 'Chắc chắn', 'いいえ nghĩa là không'),
(3, 'おはよう nghĩa là gì?', 'multiple_choice', 'Chào buổi sáng', 'Chào buổi sáng', 'Chào buổi chiều', 'Chúc ngủ ngon', 'Tạm biệt', 'おはよう nghĩa là chào buổi sáng'),
(3, 'こんばんは nghĩa là gì?', 'multiple_choice', 'Chào buổi tối', 'Chào buổi tối', 'Chào buổi sáng', 'Chào buổi chiều', 'Tạm biệt', 'こんばんは nghĩa là chào buổi tối'),
(3, 'ください nghĩa là gì?', 'multiple_choice', 'Xin cho tôi', 'Xin cho tôi', 'Cảm ơn', 'Xin lỗi', 'Tạm biệt', 'ください nghĩa là xin cho tôi'),
(3, 'どうぞ nghĩa là gì?', 'multiple_choice', 'Xin mời', 'Xin mời', 'Cảm ơn', 'Xin lỗi', 'Tạm biệt', 'どうぞ nghĩa là xin mời'),
(3, 'わたし nghĩa là gì?', 'multiple_choice', 'Tôi', 'Tôi', 'Bạn', 'Anh ấy', 'Cô ấy', 'わたし nghĩa là tôi'),
(3, 'あなた nghĩa là gì?', 'multiple_choice', 'Bạn', 'Bạn', 'Tôi', 'Anh ấy', 'Cô ấy', 'あなた nghĩa là bạn'),
(3, 'おいしい nghĩa là gì?', 'multiple_choice', 'Ngon', 'Ngon', 'Đẹp', 'Lớn', 'Nhỏ', 'おいしい nghĩa là ngon'),
(3, 'たかい nghĩa là gì?', 'multiple_choice', 'Đắt/Cao', 'Đắt/Cao', 'Rẻ/Thấp', 'Nhanh', 'Chậm', 'たかい nghĩa là đắt hoặc cao'),
(3, 'やすい nghĩa là gì?', 'multiple_choice', 'Rẻ', 'Rẻ', 'Đắt', 'Lớn', 'Nhỏ', 'やすい nghĩa là rẻ');

-- Cập nhật tổng số câu hỏi trong bảng quizzes
-- Tắt safe update mode tạm thời
SET SQL_SAFE_UPDATES = 0;

UPDATE quizzes SET total_questions = (
    SELECT COUNT(*) FROM questions WHERE quiz_id = quizzes.id
) WHERE id > 0;

-- Bật lại safe update mode
SET SQL_SAFE_UPDATES = 1;
