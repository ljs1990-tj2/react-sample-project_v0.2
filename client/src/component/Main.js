import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import DeleteIcon from '@mui/icons-material/Delete';
import { jwtDecode } from 'jwt-decode';

const Main = () => {
  const [feeds, setFeeds] = useState([]);

  async function fnDelete(id){
    if(!window.confirm("삭제하시겠습니까?")){
      return;
    };
    const res = await axios.delete(`http://localhost:3100/feed/${id}`);
    if(res.data.success){
      alert("삭제되었습니다.");
      fnList();
    } else {
      alert("오류 발생!");
    }
  }

  async function fnUpdate(id){
    const res = await axios.put(`http://localhost:3100/feed/${id}`);
    if(res.data.success){
      fnList();
    } else {
      alert("오류 발생!");
    }
  }

  async function fnList() {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get('http://localhost:3100/feed', {
        headers : {token}
      });
      if (res.data.success) {
        setFeeds(res.data.list);
        console.log(res.data.list);
      } else {
        console.log("에러");
      }
    } catch (err) {
      console.log("에러");
    } 
  };
  useEffect(() => {   
    // const token = localStorage.getItem("token");
    // const dToken = jwtDecode(token);
    // console.log(dToken);
    fnList();
  }, []);


  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={3}
      sx={{ backgroundColor: '#f0f4f8' }}
    >
      {feeds.map((feed) => (
        <Paper key={feed.id} sx={{ width: '100%', maxWidth: '600px', mb: 2, p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {feed.userId}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {feed.content}
          </Typography>
          <Typography variant="caption" color="textSecondary" gutterBottom>
            {new Date(feed.cdatetime).toLocaleString()}
          </Typography>

          <Box display="flex" justifyContent="space-between" mt={1}>
            <Box>
              <IconButton color="primary" onClick={()=>{
                fnUpdate(feed.id);
              }}>
                <ThumbUpIcon />
              </IconButton>
              <IconButton color="secondary" onClick={()=>{
                fnDelete(feed.id);
              }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default Main;
