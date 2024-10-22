import React, { useState } from 'react';
import axios from 'axios';

const Add = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  const imageChange = (e) => {
    setImages(e.target.files);
  };

  const fnSubMit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('content', content);
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }

    try {
      const response = await axios.post('http://localhost:3100/feed', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error('피드 등록 오류:', error);
    }
  };

  return (
    <form onSubmit={fnSubMit}>
      <div>
        <label>내용:</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <label>이미지 첨부:</label>
        <input type="file" multiple onChange={imageChange} />
      </div>
      <button type="submit">등록</button>
    </form>
  );
};

export default Add;
