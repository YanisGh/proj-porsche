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
  try {
    res.json({ message: 'Welcome to the Porsche API' });
  } catch {
    res.status(500).json({ success: false, message: 'Sorry, we could not load the welcome message. Please try again later.' });
  }
});

app.post('/logintest', (req, res) => {
  try {
    const { email, password } = req.body;
    
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
    // Read existing users
    let users = [];
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(usersData);
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Sorry, we could not access user data. Please try again later.' 
      });
    }
    
    // Find user by email and password
    const user = users.find(user => 
      user.email.toLowerCase() === email.toLowerCase() && 
      user.password === password
    );
    
    if (user) {
      // Return success without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ 
        success: true, 
        message: 'Login successful',
        user: userWithoutPassword
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password.' 
      });
    }
  } catch {
    res.status(500).json({ success: false, message: 'Sorry, we could not process your login. Please try again later.' });
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
  try {
    res.json({ success: true, models: filteredModels });
  } catch {
    res.status(500).json({ success: false, message: 'Sorry, we could not load the car models.' });
  }
});

app.post('/models/find', (req, res) => {
  try {
    const filters = req.body;
    const filtered = filteredModels.filter(model => {
      return Object.entries(filters).every(([key, value]) => {
        if (typeof value === 'string' && typeof model[key] === 'string') {
          // Special case for "Carrera GT" - use exact match
          if (value.toLowerCase() === 'carrera gt') {
            return model[key].toLowerCase() === value.toLowerCase();
          }
          // For other searches, use substring matching
          return model[key].toLowerCase().includes(value.toLowerCase());
        }
        return model[key] == value;
      });
    });
    res.json({ success: true, results: filtered });
  } catch {
    res.status(500).json({ success: false, message: 'Sorry, we could not find the models you are looking for. Please try again later.' });
  }
});

app.get('/fields/:field', (req, res) => {
  try {
    const { field } = req.params;
    const uniqueValues = Array.from(new Set(filteredModels.map(m => m[field]).filter(v => v !== undefined && v !== null)));
    res.json({ success: true, field, values: uniqueValues });
  } catch {
    res.status(500).json({ success: false, message: 'Sorry, we could not load the requested information. Please try again later.' });
  }
});

app.get('/fields', (req, res) => {
  try {
    if (filteredModels.length === 0) {
      return res.status(500).json({ success: false, message: 'Sorry, there are no car models available at the moment.' });
    }
    const fields = Object.keys(filteredModels[0]);
    res.json({ success: true, fields });
  } catch {
    res.status(500).json({ success: false, message: 'Sorry, we could not load the available fields. Please try again later.' });
  }
});

app.post('/signup', (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
    // Read existing users
    let users = [];
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(usersData);
    } catch (err) {
      // If file doesn't exist or is empty, start with empty array
      users = [];
    }
    
    // Check if user already exists (keep this validation as it requires database lookup)
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'An account with this email already exists.' 
      });
    }
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      email: email.toLowerCase(),
      password, // In production, you should hash this password
      firstName: firstName || '',
      lastName: lastName || '',
      createdAt: new Date().toISOString(),
      garage: [] // Initialize empty garage for user
    };
    
    // Add user to array
    users.push(newUser);
    
    // Save to file
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    // Return success (don't send password back)
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully!',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, we could not create your account. Please try again later.' 
    });
  }
});

// Get garage count for a user
app.get('/garage/count/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
    // Read existing users
    let users = [];
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(usersData);
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Sorry, we could not access user data. Please try again later.' 
      });
    }
    
    // Find user by ID
    const user = users.find(user => user.id == userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }
    
    // Return garage count
    const garageCount = user.garage ? user.garage.length : 0;
    res.json({ 
      success: true, 
      count: garageCount,
      userId: user.id 
    });
    
  } catch (error) {
    console.error('Garage count error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, we could not get garage information. Please try again later.' 
    });
  }
});

// Alternative route to get garage count by email (for when user is logged in)
app.post('/garage/count', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required.' 
      });
    }
    
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
    // Read existing users
    let users = [];
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(usersData);
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Sorry, we could not access user data. Please try again later.' 
      });
    }
    
    // Find user by email
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }
    
    // Return garage count
    const garageCount = user.garage ? user.garage.length : 0;
    res.json({ 
      success: true, 
      count: garageCount,
      userId: user.id 
    });
    
  } catch (error) {
    console.error('Garage count error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, we could not get garage information. Please try again later.' 
    });
  }
});

// Add car to user's garage
app.post('/garage/add', (req, res) => {
  try {
    const { email, carData } = req.body;
    
    if (!email || !carData) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and car data are required.' 
      });
    }
    
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
    // Read existing users
    let users = [];
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(usersData);
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Sorry, we could not access user data. Please try again later.' 
      });
    }
    
    // Find user by email
    const userIndex = users.findIndex(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }
    
    // Create car object with ID and timestamp
    const car = {
      id: Date.now(), // Simple ID generation
      ...carData,
      addedAt: new Date().toISOString()
    };
    
    // Add car to user's garage
    if (!users[userIndex].garage) {
      users[userIndex].garage = [];
    }
    users[userIndex].garage.push(car);
    
    // Save updated users data
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
    res.status(201).json({ 
      success: true, 
      message: 'Car added to garage successfully!',
      car: car,
      garageCount: users[userIndex].garage.length
    });
    
  } catch (error) {
    console.error('Add car error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, we could not add the car to your garage. Please try again later.' 
    });
  }
});

// Get all cars from user's garage
app.post('/garage/cars', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required.' 
      });
    }
    
    const usersFilePath = path.join(__dirname, 'data', 'users.json');
    
    // Read existing users
    let users = [];
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf8');
      users = JSON.parse(usersData);
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Sorry, we could not access user data. Please try again later.' 
      });
    }
    
    // Find user by email
    const user = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found.' 
      });
    }
    
    // Return user's garage cars
    const cars = user.garage || [];
    res.json({ 
      success: true, 
      cars: cars,
      count: cars.length,
      userId: user.id
    });
    
  } catch (error) {
    console.error('Get garage cars error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Sorry, we could not retrieve your garage cars. Please try again later.' 
    });
  }
});

app.use((err, req, res, next) => {
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    res.status(503).json({ success: false, message: 'Sorry, our service is currently unavailable. Please check your connection or try again in a few moments.' });
  } else {
    res.status(500).json({ success: false, message: 'Sorry, something went wrong on our end. Please try again later.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});