const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

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

let filteredModels = [];
const filePath = path.join(__dirname, 'data', 'all-porsche-model.json');

//To only retrieve specific fields from the models and use this as the base data
function loadFilteredModels() {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const models = JSON.parse(data);
    filteredModels = models.map(m => ({
      make: m.make,
      base_model: m.basemodel,
      model: m.model,
      fuel_type: m.fueltype1,
      city_mpg: m.city08,
      highway_mpg: m.highway08,
      combined_mpg: m.comb08,
      cylinders: m.cylinders,
      displ: m.displ,
      drive: m.drive,
      transmission : m.trany,
      vclass: m.vclass,
      year: m.year
    }));
  } catch (err) {
    filteredModels = [];
    console.error('Failed to load or parse models data:', err);
  }
}

loadFilteredModels();

app.get('/models', (req, res) => {
  res.json({ success: true, models: filteredModels });
});

app.post('/models/find', (req, res) => {
  const filters = req.body;
  const filtered = filteredModels.filter(model => {
    return Object.entries(filters).every(([key, value]) => {
      if (typeof value === 'string' && typeof model[key] === 'string') {
        return model[key].toLowerCase().includes(value.toLowerCase());
      }
      return model[key] == value;
    });
  });
  res.json({ success: true, results: filtered });
});

app.get('/fields/:field', (req, res) => {
  const { field } = req.params;
  const uniqueValues = Array.from(new Set(filteredModels.map(m => m[field]).filter(v => v !== undefined && v !== null)));
  res.json({ success: true, field, values: uniqueValues });
});

app.get('/fields', (req, res) => {
  if (filteredModels.length === 0) {
    return res.status(500).json({ success: false, message: 'No models loaded.' });
  }
  const fields = Object.keys(filteredModels[0]);
  res.json({ success: true, fields });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});