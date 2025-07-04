# Security & Vulnerabilities Guide

## 📊 Tình trạng Security hiện tại

Sau khi cập nhật packages, dự án đã giảm từ **9 vulnerabilities xuống 3 vulnerabilities moderate**.

### ✅ Đã khắc phục:
- **nth-check**: Cập nhật lên v2.1.1
- **postcss**: Cập nhật lên v8.4.31  
- **css-select, svgo**: Đã được resolve thông qua overrides

### ⚠️ Còn lại (3 moderate):
- **webpack-dev-server**: Chỉ ảnh hưởng development environment
- Không ảnh hưởng production build
- Liên quan đến source code exposure khi truy cập malicious websites

## 🔧 Cách kiểm tra vulnerabilities

```bash
# Kiểm tra tổng thể
npm audit

# Kiểm tra từng package
cd backend && npm audit
cd frontend && npm audit

# Tự động fix (không breaking changes)
npm audit fix

# Force fix (có thể breaking changes)
npm audit fix --force
```

## 🛡️ Biện pháp bảo mật đã implement

### 1. Package Overrides
```json
"overrides": {
  "nth-check": "^2.1.1",
  "postcss": "^8.4.31", 
  "webpack-dev-server": "^4.15.1"
}
```

### 2. Dependencies Updates
- React Scripts: 5.0.1 (latest stable)
- Axios: 1.6.2 (latest với security fixes)
- Styled Components: 6.1.1 (latest)

### 3. Development vs Production
- Vulnerabilities chỉ ảnh hưởng development
- Production build (`npm run build`) sẽ clean và secure
- Webpack-dev-server không được include trong production

## 🚀 Khuyến nghị cho Production

### 1. Environment Variables
```env
NODE_ENV=production
JWT_SECRET=your_very_secure_random_string_here
DB_PASSWORD=strong_database_password
```

### 2. Build cho Production
```bash
# Build frontend
cd frontend && npm run build

# Serve static files từ backend
# Thêm vào backend/server.js:
app.use(express.static(path.join(__dirname, '../frontend/build')));
```

### 3. Security Headers
Thêm vào `backend/server.js`:
```javascript
// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### 4. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🔄 Maintenance Schedule

### Hàng tuần:
- [ ] Chạy `npm audit` để kiểm tra vulnerabilities mới
- [ ] Cập nhật dependencies patch versions

### Hàng tháng:  
- [ ] Cập nhật minor versions của packages
- [ ] Review security advisories
- [ ] Test compatibility sau khi update

### Khi có security alert:
- [ ] Đánh giá severity level
- [ ] Update package ngay lập tức nếu critical
- [ ] Test thoroughly sau khi update

## 📝 Log của việc fix vulnerabilities

### 2024-07-04: Initial fix
- **Before**: 9 vulnerabilities (3 moderate, 6 high)
- **After**: 3 vulnerabilities (3 moderate)
- **Packages updated**: nth-check, postcss, styled-components, axios, react-router-dom

### Actions taken:
1. Updated frontend/package.json with latest versions
2. Added package overrides to force secure versions
3. Ran `npm install` to apply changes
4. Verified functionality still works

## 🆘 Troubleshooting

### Nếu gặp lỗi sau khi update:
```bash
# Xóa node_modules và reinstall
rm -rf node_modules package-lock.json
npm install

# Hoặc reset về version cũ
git checkout HEAD -- package.json
npm install
```

### Nếu vulnerabilities vẫn không mất:
1. Kiểm tra có packages nào lock versions không
2. Sử dụng `npm ls` để xem dependency tree
3. Có thể cần upgrade major version của packages

## 🔗 References

- [NPM Audit Documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [React Security Best Practices](https://github.com/facebook/react/issues/16805)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Lưu ý**: Trong môi trường học tập/demo, 3 moderate vulnerabilities còn lại có thể chấp nhận được. Trong production thực tế, nên đánh giá kỹ và có biện pháp mitigation phù hợp.
