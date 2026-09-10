const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'SmartCare Baby Platform Backend',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api', homeRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SmartCare Baby Backend running on port ${PORT}`);
});