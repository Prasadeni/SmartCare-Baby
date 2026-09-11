const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const homeRoutes = require('./routes/homeRoutes');
const babyRoutes = require('./routes/babyRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const growthRoutes = require('./routes/growthRoutes');
const reportRoutes = require('./routes/reportRoutes');
const educationRoutes = require('./routes/educationRoutes');
const vaccinationRoutes = require('./routes/vaccinationRoutes');
const specialistRoutes = require('./routes/specialistRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const adminRoutes = require('./routes/adminRoutes');

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
app.use('/api/babies', babyRoutes);
app.use('/api', dashboardRoutes);   // ← Dashboard + Daily Logs
app.use('/api', symptomRoutes);
app.use('/api', growthRoutes);   
app.use('/api', reportRoutes); 
app.use('/api', educationRoutes);
app.use('/api', vaccinationRoutes);
app.use('/api', specialistRoutes);
app.use('/api', emergencyRoutes);
app.use('/api', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`SmartCare Baby Backend running on port ${PORT}`);
});