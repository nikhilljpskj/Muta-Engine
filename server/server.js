const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Assuming you are using routes from another file like authRoutes
const authRoutes = require('./routes/authRoutes');  // Make sure this is correctly exported
const categoriesRoutes = require('./routes/categoriesRoutes');
const productRoutes = require('./routes/productRoutes');
const homeRoutes = require('./routes/homeRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Sessions
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if using HTTPS
}));

// Route setup
app.use('/api/auth', authRoutes);  
app.use('/api', categoriesRoutes); // This should be `/api` if you are using this prefix

app.use('/api/home', homeRoutes); 
app.use('/api', productRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
