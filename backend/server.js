const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Porsche API' });
});

app.post('/logintest', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'test' && password === 'test') {
    res.json({ 
      success: true, 
      message: 'Login successful',
      user: { email }
    });
  } else {
    res.status(400).json({ 
      success: false, 
      message: 'Email and password are required' 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 