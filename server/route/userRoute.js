const express = require('express')
const router = express.Router();
const connection = require('../db');

router.route("/")
    .get((req, res)=>{
        const query = 'SELECT * FROM TBL_USER';
        connection.query(query, (err, results) => {
            if (err) {
                console.error('쿼리 실행 실패:', err);
                // res.status(500).send('서버 오류');
                return;
            }
            res.render('user', { list : results }); 
        });
    })
    .post((req, res)=>{
        const { email, password } = req.body;
        const query = 'SELECT * FROM TBL_USER WHERE id = ? AND pwd = ?';
      
        connection.query(query, [email, password], (err, results) => {
          if (err) throw err;
          if (results.length > 0) {
            res.json({ success: true, message : "로그인 성공!" });
          } else {
            // 로그인 실패
            res.json({ success: false, message: '실패!' });
          }
        });
    });

router.route("/insert")
  .post((req, res)=>{
    const { email, pwd } = req.body;
    const query = 'INSERT INTO TBL_USER(id, pwd) VALUES(?, ?)';
  
    connection.query(query, [email, pwd], (err, results) => {
      if (err) {
        return res.json({success : false, message : "db 오류"});
      };

      res.json({success : true, message : "회원가입 성공!"});
    });
  });


module.exports = router;