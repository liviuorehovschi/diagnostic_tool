import React, { useState } from 'react';
import './App.css';
import { Button } from '@mui/material';
import axios from 'axios';
import diagnosisBackgroundImage from './background.jpeg';
import loginBackgroundImage from './background_2.jpg';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Incorrect username or password!');
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      setSelectedFile(file);
      setImagePreviewUrl(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('YOUR_API_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setDiagnosisResult(response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error during diagnosis. Please try again.');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="App" style={{ backgroundImage: `url(${loginBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="login-container">
          <h1>Login to Liviu's Virtual Assistant</h1>
          <form onSubmit={handleLogin}>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" color="primary" type="submit">
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App" style={{ backgroundImage: `url(${diagnosisBackgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="App-content">
        <h1>Welcome to our diagnostic tool</h1>
        <p>Please upload the picture of the chest X-ray of your patient and submit to generate a prognosis.</p>
        <input type="file" onChange={handleImageChange} />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Diagnose Image
        </Button>
        {imagePreviewUrl && (
          <div className="image-preview-container">
            <img src={imagePreviewUrl} alt="X-Ray Preview" className="image-preview" />
          </div>
        )}
        {diagnosisResult && <h3>Diagnosis Result: {diagnosisResult}</h3>}
      </div>
    </div>
  );
}

export default App;
