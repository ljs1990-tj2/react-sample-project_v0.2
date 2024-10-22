const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router();
const connection = require('../db');
const bcrypt = require('bcrypt');

const JWT_KEY = "secret_key";
const ROUND = 10;


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
        const query = 'SELECT * FROM TBL_USER WHERE id = ?';

        connection.query(query, [email], async (err, results) => {
          if (err) throw err;
          if (results.length > 0) {
            const user = results[0];
            const dbPwd = user.pwd;
            const result = await bcrypt.compare(password, dbPwd);
            console.log(result);
            if(result){
              const token = jwt.sign({userId : user.id, name : user.name}, JWT_KEY, {expiresIn : '1h'});
              res.json({ success: true, message : "로그인 성공!", token });
            } else {
              res.json({ success: false, message: '비밀번호 확인하셈' });
            }
  
          } else {
            // 로그인 실패
            res.json({ success: false, message: '실패!' });
          }
        });
    });

router.route("/insert")
  .post(async (req, res)=>{
    const { email, pwd } = req.body;
    const query = 'INSERT INTO TBL_USER(id, pwd) VALUES(?, ?)';
    
    const pwdHash = await bcrypt.hash(pwd, ROUND);
    console.log(pwdHash);
    // bcrypt.hash(pwd, ROUND, (err, hash)=>{
    //   console.log("해시 값 : ", hash);
    // });
    connection.query(query, [email, pwdHash], (err, results) => {
      if (err) {
        return res.json({success : false, message : "db 오류"});
      };

      res.json({success : true, message : "회원가입 성공!"});
    });
  });


module.exports = router;