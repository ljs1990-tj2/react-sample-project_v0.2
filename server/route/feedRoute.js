const express = require('express')
const router = express.Router();
const connection = require('../db');
const jwtAuthentication = require('../jwtAuth');
const multer = require('multer')
const path = require('path');

router.route("/")
  .get(jwtAuthentication, (req, res)=>{
      const query = 'SELECT * FROM TBL_FEED';
      connection.query(query, (err, results) => {
        if (err) {
          console.error('피드 조회 실패:', err);
          return res.json({ success: false, message: '서버 오류가 발생했습니다.' });
        }
    
        res.json({ success: true, list: results });
      });
  })

router.route("/:id")
  .delete((req, res)=>{
    const id = req.params.id;
    const query = 'DELETE FROM TBL_FEED WHERE id = ?';
  
    connection.query(query, [ id ], (err, results) => {
      if (err) {
        return res.json({success : false, message : "db 오류"});
      };

      res.json({success : true, message : "삭제 됨!"});
    });
  })
  .put((req, res)=>{
    const id = req.params.id;
    const query = 'UPDATE TBL_FEED SET FAVORITE = FAVORITE + 1 WHERE id = ?';
  
    connection.query(query, [ id ], (err, results) => {
      if (err) {
        return res.json({success : false, message : "db 오류"});
      };

      res.json({success : true, message : "수정 됨!"});
    });
  });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(file);
      cb(null, 'img/'); // 서버 내 img 폴더
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // 파일 확장자
      cb(null, Date.now() + ext); // 고유한 파일 이름으로 저장
    },
  });
const upload = multer({ storage }); 
// 피드 등록 및 이미지 업로드
router.route("/")
  .post(upload.array('images'), (req, res) => {
    const { feed_id } = req.body; 
    const imgPath = req.file.path; 

    const query = 'INSERT INTO tbl_feed_img (feed_id, img_path) VALUES (?, ?)';
    db.query(query, [feed_id, imgPath], (err, result) => {
      if (err) {
        console.error('DB 저장 실패:', err);
        return res.status(500).send('서버 오류');
      }
      res.status(200).send('파일 업로드 성공');
    });
});  

module.exports = router;