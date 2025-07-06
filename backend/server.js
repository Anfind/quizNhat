const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, full_name, level } = req.body;
        
        // Check if user exists
        db.query('SELECT * FROM users WHERE username = ? OR email = ?', [username, email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            
            if (results.length > 0) {
                return res.status(400).json({ message: 'Username hoặc email đã tồn tại' });
            }
            
            // Insert new user (không hash password theo yêu cầu)
            const insertQuery = 'INSERT INTO users (username, email, password, full_name, level) VALUES (?, ?, ?, ?, ?)';
            db.query(insertQuery, [username, email, password, full_name, level || 'N5'], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error creating user', error: err });
                }
                
                const token = jwt.sign(
                    { id: result.insertId, username, email },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );
                
                res.status(201).json({
                    message: 'Đăng ký thành công',
                    token,
                    user: {
                        id: result.insertId,
                        username,
                        email,
                        full_name,
                        level: level || 'N5'
                    }
                });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { username, password } = req.body;
        
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            
            if (results.length === 0) {
                return res.status(400).json({ message: 'Username không tồn tại' });
            }
            
            const user = results[0];
            
            // So sánh password trực tiếp (không hash)
            if (password !== user.password) {
                return res.status(400).json({ message: 'Mật khẩu không đúng' });
            }
            
            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            
            res.json({
                message: 'Đăng nhập thành công',
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    level: user.level
                }
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Courses Routes
app.get('/api/courses', (req, res) => {
    const { level } = req.query;
    let query = 'SELECT * FROM courses';
    let params = [];
    
    if (level) {
        query += ' WHERE level = ?';
        params.push(level);
    }
    
    query += ' ORDER BY created_at DESC';
    
    db.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

app.get('/api/courses/:id', (req, res) => {
    const courseId = req.params.id;
    
    db.query('SELECT * FROM courses WHERE id = ?', [courseId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json(results[0]);
    });
});

// Quiz Routes
app.get('/api/courses/:courseId/quizzes', (req, res) => {
    const courseId = req.params.courseId;
    
    db.query('SELECT * FROM quizzes WHERE course_id = ?', [courseId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

app.get('/api/quizzes/:id', (req, res) => {
    const quizId = req.params.id;
    
    const query = `
        SELECT q.*, qu.question_text, qu.question_type, qu.option_a, qu.option_b, 
               qu.option_c, qu.option_d, qu.points, qu.id as question_id
        FROM quizzes q
        LEFT JOIN questions qu ON q.id = qu.quiz_id
        WHERE q.id = ?
        ORDER BY qu.id
    `;
    
    db.query(query, [quizId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        const quiz = {
            id: results[0].id,
            course_id: results[0].course_id,
            title: results[0].title,
            description: results[0].description,
            time_limit: results[0].time_limit,
            total_questions: results[0].total_questions,
            questions: results.filter(r => r.question_id).map(r => ({
                id: r.question_id,
                question_text: r.question_text,
                question_type: r.question_type,
                option_a: r.option_a,
                option_b: r.option_b,
                option_c: r.option_c,
                option_d: r.option_d,
                points: r.points
            }))
        };
        
        res.json(quiz);
    });
});

app.post('/api/quizzes/:id/submit', authenticateToken, (req, res) => {
    const quizId = req.params.id;
    const { answers, time_taken } = req.body;
    const userId = req.user.id;
    
    // Get quiz and questions
    const getQuizQuery = `
        SELECT q.*, qu.id as question_id, qu.correct_answer, qu.points
        FROM quizzes q
        JOIN questions qu ON q.id = qu.quiz_id
        WHERE q.id = ?
    `;
    
    db.query(getQuizQuery, [quizId], (err, questions) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        let correctAnswers = 0;
        let totalScore = 0;
        let maxScore = 0;
        
        const userAnswers = [];
        
        questions.forEach(question => {
            maxScore += question.points;
            const userAnswer = answers[question.question_id];
            const isCorrect = userAnswer === question.correct_answer;
            
            if (isCorrect) {
                correctAnswers++;
                totalScore += question.points;
            }
            
            userAnswers.push({
                question_id: question.question_id,
                user_answer: userAnswer || '',
                is_correct: isCorrect
            });
        });
        
        const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
        
        // Save quiz result
        const insertResultQuery = `
            INSERT INTO quiz_results (user_id, quiz_id, score, total_questions, correct_answers, time_taken)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        db.query(insertResultQuery, [userId, quizId, scorePercentage, questions.length, correctAnswers, time_taken], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error saving result', error: err });
            }
            
            const resultId = result.insertId;
            
            // Save user answers
            const insertAnswersQuery = `
                INSERT INTO user_answers (result_id, question_id, user_answer, is_correct)
                VALUES ?
            `;
            
            const answerValues = userAnswers.map(answer => [
                resultId,
                answer.question_id,
                answer.user_answer,
                answer.is_correct
            ]);
            
            db.query(insertAnswersQuery, [answerValues], (err) => {
                if (err) {
                    console.error('Error saving answers:', err);
                }
                
                res.json({
                    result_id: resultId,
                    score: scorePercentage,
                    correct_answers: correctAnswers,
                    total_questions: questions.length,
                    time_taken,
                    passed: scorePercentage >= 60
                });
            });
        });
    });
});

// Results Routes
app.get('/api/user/results', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    const query = `
        SELECT qr.*, q.title as quiz_title, c.title as course_title, c.level
        FROM quiz_results qr
        JOIN quizzes q ON qr.quiz_id = q.id
        JOIN courses c ON q.course_id = c.id
        WHERE qr.user_id = ?
        ORDER BY qr.completed_at DESC
    `;
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        // Convert score từ string thành number
        const processedResults = results.map(result => ({
            ...result,
            score: parseFloat(result.score),
            time_taken: parseInt(result.time_taken)
        }));
        
        res.json(processedResults);
    });
});

app.get('/api/results/:id', authenticateToken, (req, res) => {
    const resultId = req.params.id;
    const userId = req.user.id;
    
    const query = `
        SELECT qr.*, q.title as quiz_title, c.title as course_title,
               ua.question_id, ua.user_answer, ua.is_correct,
               qu.question_text, qu.correct_answer, qu.explanation
        FROM quiz_results qr
        JOIN quizzes q ON qr.quiz_id = q.id
        JOIN courses c ON q.course_id = c.id
        LEFT JOIN user_answers ua ON qr.id = ua.result_id
        LEFT JOIN questions qu ON ua.question_id = qu.id
        WHERE qr.id = ? AND qr.user_id = ?
    `;
    
    db.query(query, [resultId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Result not found' });
        }
        
        const result = {
            id: results[0].id,
            quiz_title: results[0].quiz_title,
            course_title: results[0].course_title,
            score: parseFloat(results[0].score),
            correct_answers: parseInt(results[0].correct_answers),
            total_questions: parseInt(results[0].total_questions),
            time_taken: parseInt(results[0].time_taken),
            completed_at: results[0].completed_at,
            answers: results.filter(r => r.question_id).map(r => ({
                question_id: r.question_id,
                question_text: r.question_text,
                user_answer: r.user_answer,
                correct_answer: r.correct_answer,
                is_correct: r.is_correct,
                explanation: r.explanation
            }))
        };
        
        res.json(result);
    });
});

// Progress Routes
app.post('/api/courses/:id/progress', authenticateToken, (req, res) => {
    const courseId = req.params.id;
    const userId = req.user.id;
    const { progress_percentage } = req.body;
    
    const query = `
        INSERT INTO user_progress (user_id, course_id, progress_percentage)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE 
        progress_percentage = VALUES(progress_percentage),
        last_accessed = CURRENT_TIMESTAMP,
        completed = IF(VALUES(progress_percentage) >= 100, TRUE, FALSE)
    `;
    
    db.query(query, [userId, courseId, progress_percentage], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: 'Progress updated successfully' });
    });
});

app.get('/api/user/progress', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    const query = `
        SELECT up.*, c.title as course_title, c.level, c.thumbnail
        FROM user_progress up
        JOIN courses c ON up.course_id = c.id
        WHERE up.user_id = ?
        ORDER BY up.last_accessed DESC
    `;
    
    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Admin middleware
const requireAdmin = (req, res, next) => {
    if (req.user.username !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// ==================== ADMIN ROUTES ====================

// Get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
    const query = `
        SELECT id, username, email, full_name, level, created_at,
        (SELECT COUNT(*) FROM quiz_results WHERE user_id = users.id) as total_quizzes
        FROM users 
        ORDER BY created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Delete user
app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, (req, res) => {
    const userId = req.params.id;
    
    if (userId == 1) { // Protect admin user
        return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    
    // Delete user and related data
    const queries = [
        'DELETE FROM user_answers WHERE user_id = ?',
        'DELETE FROM quiz_results WHERE user_id = ?',
        'DELETE FROM user_progress WHERE user_id = ?',
        'DELETE FROM users WHERE id = ?'
    ];
    
    let completed = 0;
    queries.forEach((query, index) => {
        db.query(query, [userId], (err) => {
            if (err && index === queries.length - 1) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            completed++;
            if (completed === queries.length) {
                res.json({ message: 'User deleted successfully' });
            }
        });
    });
});

// Get all courses
app.get('/api/admin/courses', authenticateToken, requireAdmin, (req, res) => {
    const query = `
        SELECT c.*, 
        (SELECT COUNT(*) FROM quizzes WHERE course_id = c.id) as quiz_count
        FROM courses c 
        ORDER BY c.created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Create course
app.post('/api/admin/courses', authenticateToken, requireAdmin, (req, res) => {
    const { title, description, level, duration, video_url, thumbnail } = req.body;
    
    if (!title || !description || !level) {
        return res.status(400).json({ message: 'Title, description and level are required' });
    }
    
    const query = `
        INSERT INTO courses (title, description, level, duration, video_url, thumbnail)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [title, description, level, duration || 30, video_url, thumbnail], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ 
            message: 'Course created successfully', 
            courseId: result.insertId 
        });
    });
});

// Update course
app.put('/api/admin/courses/:id', authenticateToken, requireAdmin, (req, res) => {
    const courseId = req.params.id;
    const { title, description, level, duration, video_url, thumbnail } = req.body;
    
    const query = `
        UPDATE courses 
        SET title = ?, description = ?, level = ?, duration = ?, video_url = ?, thumbnail = ?
        WHERE id = ?
    `;
    
    db.query(query, [title, description, level, duration, video_url, thumbnail, courseId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: 'Course updated successfully' });
    });
});

// Delete course
app.delete('/api/admin/courses/:id', authenticateToken, requireAdmin, (req, res) => {
    const courseId = req.params.id;
    
    // Delete course and related data
    const queries = [
        'DELETE FROM user_answers WHERE quiz_id IN (SELECT id FROM quizzes WHERE course_id = ?)',
        'DELETE FROM quiz_results WHERE quiz_id IN (SELECT id FROM quizzes WHERE course_id = ?)',
        'DELETE FROM questions WHERE quiz_id IN (SELECT id FROM quizzes WHERE course_id = ?)',
        'DELETE FROM quizzes WHERE course_id = ?',
        'DELETE FROM user_progress WHERE course_id = ?',
        'DELETE FROM courses WHERE id = ?'
    ];
    
    let completed = 0;
    queries.forEach((query, index) => {
        db.query(query, [courseId], (err) => {
            if (err && index === queries.length - 1) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            completed++;
            if (completed === queries.length) {
                res.json({ message: 'Course deleted successfully' });
            }
        });
    });
});

// Get all quizzes
app.get('/api/admin/quizzes', authenticateToken, requireAdmin, (req, res) => {
    const query = `
        SELECT q.*, c.title as course_title,
        (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as question_count,
        (SELECT COUNT(*) FROM quiz_results WHERE quiz_id = q.id) as attempt_count
        FROM quizzes q
        LEFT JOIN courses c ON q.course_id = c.id
        ORDER BY q.created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Create quiz
app.post('/api/admin/quizzes', authenticateToken, requireAdmin, (req, res) => {
    const { title, description, course_id, time_limit, passing_score } = req.body;
    
    if (!title || !description || !course_id) {
        return res.status(400).json({ message: 'Title, description and course_id are required' });
    }
    
    const query = `
        INSERT INTO quizzes (title, description, course_id, time_limit, passing_score, total_questions)
        VALUES (?, ?, ?, ?, ?, 0)
    `;
    
    db.query(query, [title, description, course_id, time_limit || 10, passing_score || 60], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ 
            message: 'Quiz created successfully', 
            quizId: result.insertId 
        });
    });
});

// Update quiz
app.put('/api/admin/quizzes/:id', authenticateToken, requireAdmin, (req, res) => {
    const quizId = req.params.id;
    const { title, description, course_id, time_limit, passing_score } = req.body;
    
    const query = `
        UPDATE quizzes 
        SET title = ?, description = ?, course_id = ?, time_limit = ?, passing_score = ?
        WHERE id = ?
    `;
    
    db.query(query, [title, description, course_id, time_limit, passing_score, quizId], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ message: 'Quiz updated successfully' });
    });
});

// Delete quiz
app.delete('/api/admin/quizzes/:id', authenticateToken, requireAdmin, (req, res) => {
    const quizId = req.params.id;
    
    // Delete quiz and related data
    const queries = [
        'DELETE FROM user_answers WHERE quiz_id = ?',
        'DELETE FROM quiz_results WHERE quiz_id = ?',
        'DELETE FROM questions WHERE quiz_id = ?',
        'DELETE FROM quizzes WHERE id = ?'
    ];
    
    let completed = 0;
    queries.forEach((query, index) => {
        db.query(query, [quizId], (err) => {
            if (err && index === queries.length - 1) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            completed++;
            if (completed === queries.length) {
                res.json({ message: 'Quiz deleted successfully' });
            }
        });
    });
});

// Get single quiz for admin
app.get('/api/admin/quiz/:id', authenticateToken, requireAdmin, (req, res) => {
    const quizId = req.params.id;
    
    const query = `
        SELECT q.*, c.title as course_title 
        FROM quizzes q 
        LEFT JOIN courses c ON q.course_id = c.id 
        WHERE q.id = ?
    `;
    
    db.query(query, [quizId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        res.json(results[0]);
    });
});

// Get questions for a quiz
app.get('/api/admin/quizzes/:id/questions', authenticateToken, requireAdmin, (req, res) => {
    const quizId = req.params.id;
    
    const query = 'SELECT * FROM questions WHERE quiz_id = ? ORDER BY id';
    
    db.query(query, [quizId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Create question for a specific quiz
app.post('/api/admin/quiz/:quizId/questions', authenticateToken, requireAdmin, (req, res) => {
    const quizId = req.params.quizId;
    const { question_text, correct_answer, option_a, option_b, option_c, option_d } = req.body;
    
    if (!question_text || !correct_answer || !option_a || !option_b) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin câu hỏi và ít nhất 2 đáp án A, B' });
    }
    
    const query = `
        INSERT INTO questions (quiz_id, question_text, question_type, correct_answer, option_a, option_b, option_c, option_d)
        VALUES (?, ?, 'multiple_choice', ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [quizId, question_text, correct_answer, option_a, option_b, option_c || null, option_d || null], (err, result) => {
        if (err) {
            console.error('Error creating question:', err);
            return res.status(500).json({ error: 'Lỗi khi tạo câu hỏi' });
        }
        
        res.status(201).json({ 
            message: 'Tạo câu hỏi thành công',
            questionId: result.insertId 
        });
    });
});

// Update question
app.put('/api/admin/questions/:id', authenticateToken, requireAdmin, (req, res) => {
    const questionId = req.params.id;
    const { question_text, correct_answer, option_a, option_b, option_c, option_d } = req.body;
    
    if (!question_text || !correct_answer || !option_a || !option_b) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin câu hỏi và ít nhất 2 đáp án A, B' });
    }
    
    const query = `
        UPDATE questions 
        SET question_text = ?, correct_answer = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?
        WHERE id = ?
    `;
    
    db.query(query, [question_text, correct_answer, option_a, option_b, option_c || null, option_d || null, questionId], (err) => {
        if (err) {
            console.error('Error updating question:', err);
            return res.status(500).json({ error: 'Lỗi khi cập nhật câu hỏi' });
        }
        res.json({ message: 'Cập nhật câu hỏi thành công' });
    });
});

// Delete question
app.delete('/api/admin/questions/:id', authenticateToken, requireAdmin, (req, res) => {
    const questionId = req.params.id;
    
    // Get quiz_id first
    db.query('SELECT quiz_id FROM questions WHERE id = ?', [questionId], (err, results) => {
        if (err) {
            console.error('Error finding question:', err);
            return res.status(500).json({ error: 'Lỗi khi tìm câu hỏi' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy câu hỏi' });
        }
        
        const quizId = results[0].quiz_id;
        
        // Delete question
        db.query('DELETE FROM questions WHERE id = ?', [questionId], (deleteErr) => {
            if (deleteErr) {
                console.error('Error deleting question:', deleteErr);
                return res.status(500).json({ error: 'Lỗi khi xóa câu hỏi' });
            }
            
            // Update quiz total_questions count
            const updateQuery = 'UPDATE quizzes SET total_questions = (SELECT COUNT(*) FROM questions WHERE quiz_id = ?) WHERE id = ?';
            db.query(updateQuery, [quizId, quizId], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating quiz question count:', updateErr);
                }
            });
            
            res.json({ message: 'Xóa câu hỏi thành công' });
        });
    });
});

// Get admin dashboard stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
    const queries = {
        totalUsers: 'SELECT COUNT(*) as count FROM users',
        totalCourses: 'SELECT COUNT(*) as count FROM courses',
        totalQuizzes: 'SELECT COUNT(*) as count FROM quizzes',
        totalQuestions: 'SELECT COUNT(*) as count FROM questions',
        totalAttempts: 'SELECT COUNT(*) as count FROM quiz_results',
        recentUsers: 'SELECT username, email, created_at FROM users ORDER BY created_at DESC LIMIT 5',
        recentResults: `
            SELECT u.username, q.title as quiz_title, qr.score, qr.completed_at 
            FROM quiz_results qr 
            JOIN users u ON qr.user_id = u.id 
            JOIN quizzes q ON qr.quiz_id = q.id 
            ORDER BY qr.completed_at DESC LIMIT 10
        `
    };
    
    const stats = {};
    let completed = 0;
    const totalQueries = Object.keys(queries).length;
    
    Object.keys(queries).forEach(key => {
        db.query(queries[key], (err, results) => {
            if (err) {
                console.error(`Error in ${key}:`, err);
                stats[key] = key.includes('recent') ? [] : 0;
            } else {
                if (key.includes('recent')) {
                    stats[key] = results;
                } else {
                    stats[key] = results[0].count;
                }
            }
            
            completed++;
            if (completed === totalQueries) {
                res.json(stats);
            }
        });
    });
});

// Admin middleware
const isAdmin = (req, res, next) => {
    if (req.user.username !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// ================= ADMIN ROUTES =================

// Admin - Get all users
app.get('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
    const query = `
        SELECT id, username, email, full_name, level, created_at,
               (SELECT COUNT(*) FROM quiz_results WHERE user_id = users.id) as quiz_count
        FROM users 
        ORDER BY created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Admin - Create user
app.post('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
    const { username, email, password, full_name, level } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email and password are required' });
    }
    
    const query = 'INSERT INTO users (username, email, password, full_name, level) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [username, email, password, full_name || '', level || 'N5'], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'User created successfully', id: result.insertId });
    });
});

// Admin - Update user
app.put('/api/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
    const userId = req.params.id;
    const { username, email, full_name, level } = req.body;
    
    const query = 'UPDATE users SET username = ?, email = ?, full_name = ?, level = ? WHERE id = ?';
    db.query(query, [username, email, full_name, level, userId], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Username or email already exists' });
            }
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'User updated successfully' });
    });
});

// Admin - Delete user
app.delete('/api/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
    const userId = req.params.id;
    
    // Don't allow deleting admin user
    if (userId === '1') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    
    const query = 'DELETE FROM users WHERE id = ?';
    db.query(query, [userId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully' });
    });
});

// Admin - Get all courses
app.get('/api/admin/courses', authenticateToken, isAdmin, (req, res) => {
    const query = `
        SELECT c.*, 
               (SELECT COUNT(*) FROM quizzes WHERE course_id = c.id) as quiz_count
        FROM courses c 
        ORDER BY c.created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Admin - Create course
app.post('/api/admin/courses', authenticateToken, isAdmin, (req, res) => {
    const { title, description, level, duration, video_url, thumbnail } = req.body;
    
    if (!title || !description || !level) {
        return res.status(400).json({ message: 'Title, description and level are required' });
    }
    
    const query = 'INSERT INTO courses (title, description, level, duration, video_url, thumbnail) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [title, description, level, duration || 60, video_url, thumbnail], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'Course created successfully', id: result.insertId });
    });
});

// Admin - Update course
app.put('/api/admin/courses/:id', authenticateToken, isAdmin, (req, res) => {
    const courseId = req.params.id;
    const { title, description, level, duration, video_url, thumbnail } = req.body;
    
    const query = 'UPDATE courses SET title = ?, description = ?, level = ?, duration = ?, video_url = ?, thumbnail = ? WHERE id = ?';
    db.query(query, [title, description, level, duration, video_url, thumbnail, courseId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json({ message: 'Course updated successfully' });
    });
});

// Admin - Delete course
app.delete('/api/admin/courses/:id', authenticateToken, isAdmin, (req, res) => {
    const courseId = req.params.id;
    
    const query = 'DELETE FROM courses WHERE id = ?';
    db.query(query, [courseId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Course not found' });
        }
        
        res.json({ message: 'Course deleted successfully' });
    });
});

// Admin - Get all quizzes
app.get('/api/admin/quizzes', authenticateToken, isAdmin, (req, res) => {
    const query = `
        SELECT q.*, c.title as course_title,
               (SELECT COUNT(*) FROM questions WHERE quiz_id = q.id) as question_count,
               (SELECT COUNT(*) FROM quiz_results WHERE quiz_id = q.id) as attempt_count
        FROM quizzes q 
        LEFT JOIN courses c ON q.course_id = c.id
        ORDER BY q.created_at DESC
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Admin - Create quiz
app.post('/api/admin/quizzes', authenticateToken, isAdmin, (req, res) => {
    const { title, description, course_id, time_limit, pass_score } = req.body;
    
    if (!title || !description || !course_id) {
        return res.status(400).json({ message: 'Title, description and course_id are required' });
    }
    
    const query = 'INSERT INTO quizzes (title, description, course_id, time_limit, pass_score, total_questions) VALUES (?, ?, ?, ?, ?, 0)';
    db.query(query, [title, description, course_id, time_limit || 15, pass_score || 60], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.status(201).json({ message: 'Quiz created successfully', id: result.insertId });
    });
});

// Admin - Update quiz
app.put('/api/admin/quizzes/:id', authenticateToken, isAdmin, (req, res) => {
    const quizId = req.params.id;
    const { title, description, course_id, time_limit, pass_score } = req.body;
    
    const query = 'UPDATE quizzes SET title = ?, description = ?, course_id = ?, time_limit = ?, pass_score = ? WHERE id = ?';
    db.query(query, [title, description, course_id, time_limit, pass_score, quizId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        res.json({ message: 'Quiz updated successfully' });
    });
});

// Admin - Delete quiz
app.delete('/api/admin/quizzes/:id', authenticateToken, isAdmin, (req, res) => {
    const quizId = req.params.id;
    
    const query = 'DELETE FROM quizzes WHERE id = ?';
    db.query(query, [quizId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        res.json({ message: 'Quiz deleted successfully' });
    });
});

// Admin - Get quiz details
app.get('/api/admin/quizzes/:id', authenticateToken, isAdmin, (req, res) => {
    const quizId = req.params.id;
    
    const query = `
        SELECT q.*, c.title as course_title
        FROM quizzes q 
        LEFT JOIN courses c ON q.course_id = c.id
        WHERE q.id = ?
    `;
    
    db.query(query, [quizId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        
        res.json(results[0]);
    });
});

// Admin - Get questions for a quiz
app.get('/api/admin/quizzes/:id/questions', authenticateToken, isAdmin, (req, res) => {
    const quizId = req.params.id;
    
    const query = 'SELECT * FROM questions WHERE quiz_id = ? ORDER BY id';
    db.query(query, [quizId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json(results);
    });
});

// Admin - Create question
app.post('/api/admin/quizzes/:id/questions', authenticateToken, isAdmin, (req, res) => {
    const quizId = req.params.id;
    const { question_text, question_type, correct_answer, option_a, option_b, option_c, option_d, explanation } = req.body;
    
    if (!question_text || !correct_answer) {
        return res.status(400).json({ message: 'Question text and correct answer are required' });
    }
    
    const query = `
        INSERT INTO questions (quiz_id, question_text, question_type, correct_answer, option_a, option_b, option_c, option_d, explanation) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(query, [quizId, question_text, question_type || 'multiple_choice', correct_answer, option_a, option_b, option_c, option_d, explanation], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        // Update total_questions count
        const updateQuery = 'UPDATE quizzes SET total_questions = (SELECT COUNT(*) FROM questions WHERE quiz_id = ?) WHERE id = ?';
        db.query(updateQuery, [quizId, quizId], (updateErr) => {
            if (updateErr) {
                console.error('Error updating question count:', updateErr);
            }
        });
        
        res.status(201).json({ message: 'Question created successfully', id: result.insertId });
    });
});

// Admin - Update question
app.put('/api/admin/questions/:id', authenticateToken, isAdmin, (req, res) => {
    const questionId = req.params.id;
    const { question_text, question_type, correct_answer, option_a, option_b, option_c, option_d, explanation } = req.body;
    
    const query = `
        UPDATE questions 
        SET question_text = ?, question_type = ?, correct_answer = ?, option_a = ?, option_b = ?, option_c = ?, option_d = ?, explanation = ?
        WHERE id = ?
    `;
    
    db.query(query, [question_text, question_type, correct_answer, option_a, option_b, option_c, option_d, explanation, questionId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        res.json({ message: 'Question updated successfully' });
    });
});

// Admin - Delete question
app.delete('/api/admin/questions/:id', authenticateToken, isAdmin, (req, res) => {
    const questionId = req.params.id;
    
    // Get quiz_id before deleting
    const getQuizQuery = 'SELECT quiz_id FROM questions WHERE id = ?';
    db.query(getQuizQuery, [questionId], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'Question not found' });
        }
        
        const quizId = results[0].quiz_id;
        
        const deleteQuery = 'DELETE FROM questions WHERE id = ?';
        db.query(deleteQuery, [questionId], (deleteErr, deleteResult) => {
            if (deleteErr) {
                return res.status(500).json({ message: 'Database error', error: deleteErr });
            }
            
            // Update total_questions count
            const updateQuery = 'UPDATE quizzes SET total_questions = (SELECT COUNT(*) FROM questions WHERE quiz_id = ?) WHERE id = ?';
            db.query(updateQuery, [quizId, quizId], (updateErr) => {
                if (updateErr) {
                    console.error('Error updating question count:', updateErr);
                }
            });
            
            res.json({ message: 'Question deleted successfully' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
