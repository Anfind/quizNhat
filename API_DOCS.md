# API Documentation - Quiz Nhat

## 📖 Tổng quan

API RESTful cho hệ thống học tập tiếng Nhật Quiz Nhat. Tất cả responses đều ở định dạng JSON.

**Base URL:** `http://localhost:5000`

## 🔐 Authentication

API sử dụng JWT (JSON Web Token) để xác thực. Token được gửi trong header:
```
Authorization: Bearer <token>
```

## 📋 Endpoints

### 🔑 Authentication

#### POST /api/auth/register
Đăng ký tài khoản mới.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "full_name": "string",
  "level": "N5|N4|N3|N2|N1" // optional, default: "N5"
}
```

**Response Success (201):**
```json
{
  "message": "Đăng ký thành công",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A",
    "level": "N5"
  }
}
```

**Response Error (400):**
```json
{
  "message": "Username hoặc email đã tồn tại"
}
```

#### POST /api/auth/login
Đăng nhập hệ thống.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response Success (200):**
```json
{
  "message": "Đăng nhập thành công",
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "user123",
    "email": "user@example.com",
    "full_name": "Nguyễn Văn A",
    "level": "N5"
  }
}
```

**Response Error (400):**
```json
{
  "message": "Username không tồn tại"
}
```

### 📚 Courses

#### GET /api/courses
Lấy danh sách khóa học.

**Query Parameters:**
- `level` (optional): Lọc theo cấp độ (N5, N4, N3, N2, N1)

**Response Success (200):**
```json
[
  {
    "id": 1,
    "title": "Hiragana Cơ Bản",
    "description": "Học bảng chữ cái Hiragana từ A-Z",
    "level": "N5",
    "video_url": "https://www.youtube.com/embed/6p9Il_j0zjc",
    "thumbnail": "/images/hiragana.jpg",
    "duration": 45,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/courses/:id
Lấy chi tiết khóa học.

**Response Success (200):**
```json
{
  "id": 1,
  "title": "Hiragana Cơ Bản",
  "description": "Học bảng chữ cái Hiragana từ A-Z",
  "level": "N5",
  "video_url": "https://www.youtube.com/embed/6p9Il_j0zjc",
  "thumbnail": "/images/hiragana.jpg",
  "duration": 45,
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

**Response Error (404):**
```json
{
  "message": "Course not found"
}
```

### 📝 Quizzes

#### GET /api/courses/:courseId/quizzes
Lấy danh sách quiz của khóa học.

**Response Success (200):**
```json
[
  {
    "id": 1,
    "course_id": 1,
    "title": "Kiểm tra Hiragana",
    "description": "Bài kiểm tra kiến thức Hiragana cơ bản",
    "time_limit": 15,
    "total_questions": 10,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

#### GET /api/quizzes/:id
Lấy chi tiết quiz và câu hỏi.

**Response Success (200):**
```json
{
  "id": 1,
  "course_id": 1,
  "title": "Kiểm tra Hiragana",
  "description": "Bài kiểm tra kiến thức Hiragana cơ bản",
  "time_limit": 15,
  "total_questions": 10,
  "questions": [
    {
      "id": 1,
      "question_text": "Chữ あ đọc như thế nào?",
      "question_type": "multiple_choice",
      "option_a": "a",
      "option_b": "i",
      "option_c": "u",
      "option_d": "e",
      "points": 1
    }
  ]
}
```

#### POST /api/quizzes/:id/submit
Nộp bài quiz. **Requires Authentication**

**Request Body:**
```json
{
  "answers": {
    "1": "a",  // question_id: answer
    "2": "ka",
    "3": "sa"
  },
  "time_taken": 300  // seconds
}
```

**Response Success (200):**
```json
{
  "result_id": 1,
  "score": 80.0,
  "correct_answers": 8,
  "total_questions": 10,
  "time_taken": 300,
  "passed": true
}
```

### 📊 Results

#### GET /api/user/results
Lấy lịch sử kết quả của user. **Requires Authentication**

**Response Success (200):**
```json
[
  {
    "id": 1,
    "quiz_id": 1,
    "score": 80.0,
    "total_questions": 10,
    "correct_answers": 8,
    "time_taken": 300,
    "completed_at": "2024-01-01T00:00:00.000Z",
    "quiz_title": "Kiểm tra Hiragana",
    "course_title": "Hiragana Cơ Bản",
    "level": "N5"
  }
]
```

#### GET /api/results/:id
Lấy chi tiết kết quả quiz. **Requires Authentication**

**Response Success (200):**
```json
{
  "id": 1,
  "quiz_title": "Kiểm tra Hiragana",
  "course_title": "Hiragana Cơ Bản",
  "score": 80.0,
  "correct_answers": 8,
  "total_questions": 10,
  "time_taken": 300,
  "completed_at": "2024-01-01T00:00:00.000Z",
  "answers": [
    {
      "question_id": 1,
      "question_text": "Chữ あ đọc như thế nào?",
      "user_answer": "a",
      "correct_answer": "a",
      "is_correct": true,
      "explanation": "あ được đọc là \"a\""
    }
  ]
}
```

### 📈 Progress

#### POST /api/courses/:id/progress
Cập nhật tiến độ học tập. **Requires Authentication**

**Request Body:**
```json
{
  "progress_percentage": 75.5
}
```

**Response Success (200):**
```json
{
  "message": "Progress updated successfully"
}
```

#### GET /api/user/progress
Lấy tiến độ học tập của user. **Requires Authentication**

**Response Success (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "course_id": 1,
    "progress_percentage": 75.5,
    "last_accessed": "2024-01-01T00:00:00.000Z",
    "completed": false,
    "course_title": "Hiragana Cơ Bản",
    "level": "N5",
    "thumbnail": "/images/hiragana.jpg"
  }
]
```

## 🔧 Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "message": "Invalid token"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error",
  "error": "Detailed error message"
}
```

## 📝 Data Types

### Question Types
- `multiple_choice`: Câu hỏi trắc nghiệm 4 đáp án
- `true_false`: Câu hỏi đúng/sai
- `fill_blank`: Câu hỏi điền từ

### Levels
- `N5`: Cơ bản
- `N4`: Sơ cấp
- `N3`: Trung cấp
- `N2`: Trung cao cấp
- `N1`: Cao cấp

## 🧪 Testing

### Postman Collection
Sử dụng Postman để test API:

1. **Set Environment Variables:**
   - `baseUrl`: `http://localhost:5000`
   - `token`: JWT token after login

2. **Test Flow:**
   1. Register new user
   2. Login to get token
   3. Get courses list
   4. Get quiz details
   5. Submit quiz
   6. Get results

### cURL Examples

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "123456",
    "full_name": "Test User",
    "level": "N5"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "123456"
  }'
```

**Get Courses:**
```bash
curl -X GET http://localhost:5000/api/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔒 Security Notes

1. **Password Storage**: Passwords được lưu plaintext theo yêu cầu (không hash)
2. **JWT Secret**: Thay đổi `JWT_SECRET` trong production
3. **CORS**: Đã cấu hình cho development, cần điều chỉnh cho production
4. **Rate Limiting**: Chưa implement, nên thêm trong production

## 📚 References

- [Express.js Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io/)
- [HTTP Status Codes](https://httpstatuses.com/)
