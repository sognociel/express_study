const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

try {
  fs.readdirSync('uploads'); // 폴더 확인
} catch (err) {
  fs.mkdirSync('uploads'); // 폴더 생성
}

const upload = multer({
  storage: multer.diskStorage({
    // 저장하는 공간: 하드디스크
    destination: function (req, res, cb) {
      // 저장 위치
      cb(null, 'uploads/'); // uploads라는 폴더 안에 저장
    },
    filename: function (req, res, cb) {
      const ext = path.extname(res.originalname); // 파일의 확장자
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${res.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5메가로 용량 제한
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'multer-study.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
