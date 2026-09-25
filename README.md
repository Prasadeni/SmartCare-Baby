# SmartCare Baby

A full-stack maternal and child health platform for early childhood care and autism support.

React · Node.js · Express · MongoDB · RAG · Google Gemini

## About the Project

SmartCare Baby is a full-stack maternal and child health platform designed to support pregnant mothers, caregivers, and administrators.
The platform allows users to track pregnancy, manage baby profiles, monitor child development, record growth and vaccinations, complete health assessments, find paediatric specialists, access educational resources, and receive AI-assisted health information.
The system also includes a Retrieval-Augmented Generation service that uses a clinical knowledge base to provide context-aware responses.

## Key Features

### For Caregivers and Pregnant Mothers

1. Pregnancy Tracker
   Week-by-week pregnancy progression, trimester information, baby size references, due date calculations, and days-to-go tracking.

2. Kick Counter
   Session-based fetal movement tracking with seven-day trends and guideline information.

3. Contraction Timer
   Record contraction duration, intensity, frequency, and patterns.

4. Weight Logger
   Track pregnancy weight with gestational week calculations and healthy-range information.

5. Baby Profiles
   Create and manage multiple baby profiles with personal information, photographs, birth details, and blood group information.

6. Symptom Checker
   Rule-based symptom assessment with Green, Yellow, and Red risk categories and red-flag detection.

7. Milestone Checklist
   Track developmental milestones across motor, language, cognitive, social, and other development areas.

8. M-CHAT-R Autism Screener
   A 20-question autism screening assessment with risk categories and printable reports.

9. Growth Tracker
   Record weight, height, and head circumference with growth and percentile information.

10. Vaccination Records
    Manage vaccination information based on the Sri Lankan national immunization schedule.

11. Specialist Locator
    Find paediatric specialists and access medical appointment information.

12. Emergency Assistance
    Access important Sri Lankan emergency contacts, including Suwa Seriya 1990.

13. Education Hub
    Access curated maternal and child health information from trusted health organizations.

14. Health Reports
    Generate printable reports for assessments, milestones, symptoms, and growth records.

15. AI Health Assistant
    RAG-powered assistant using a clinical and health knowledge base.

### For Administrators

1. Analytics Dashboard
   View user statistics, recent activity, and downloadable data.

2. Content Management
   Manage symptoms, milestones, specialists, educational articles, emergency contacts, and risk thresholds.

3. User Management
   Manage user accounts, deactivate accounts, and reactivate accounts.

4. Assessment Review
   Review symptom, milestone, and M-CHAT-R assessments.

5. Notifications
   Receive notifications for new registrations and high-risk assessments.

6. Admin Settings
   Manage administrator profile information and password settings.

## Technology Stack

### Frontend

React 18
Vite
React Router
Axios
Context API
Tailwind CSS
Recharts
Material Symbols

### Backend

Node.js
Express
MongoDB
Mongoose
JWT Authentication
bcryptjs
CORS
dotenv

### RAG AI Service

Node.js and Express
MongoDB Atlas Vector Search
Google Gemini API
Clinical and health knowledge base

Knowledge sources include WHO, ACOG, IOM, AAP, and other clinical guidance.

## System Architecture

```text
User
  |
  v
React Frontend
localhost:5173
  |
  | Axios / REST API
  v
Express Backend
localhost:5000
  |
  | Mongoose
  v
MongoDB
localhost:27017


React Frontend
  |
  v
RAG Chatbot Service
localhost:5001
  |
  | Vector Search
  v
MongoDB Atlas
  |
  v
Google Gemini
```

## Getting Started

### Prerequisites

Node.js version 18 or higher

MongoDB Community version 6 or higher

Git

MongoDB Compass is optional.

### Install MongoDB on macOS

```bash
brew tap mongodb/brew
brew install mongodb-community
```

To install MongoDB Compass:

```bash
brew install --cask mongodb-compass
```

### Clone the Repository

```bash
git clone https://github.com/Prasadeni/SmartCare-Baby.git
cd SmartCare-Baby
```

### Install Dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd ../frontend
npm install
```

RAG service:

```bash
cd ../rag-service
npm install
```

## Environment Variables

Create a separate `.env` file inside each service folder.

Do not commit `.env` files to GitHub.

### Backend Environment

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smartcare
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### Frontend Environment

```env
VITE_API_URL=http://localhost:5000/api
VITE_USE_MOCK=false
VITE_RAG_API_URL=http://localhost:5001
```

### RAG Service Environment

```env
PORT=5001
MONGO_URI=mongodb+srv://...
GEMINI_API_KEY=your_google_gemini_api_key
```

## Running the Application

The application uses MongoDB, the backend API, and the frontend. The RAG service can also be started when the AI assistant is required.

### Start MongoDB

```bash
brew services start mongodb-community
```

Check MongoDB:

```bash
lsof -i :27017
```

### Start the Backend

Open a terminal:

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

### Start the RAG Service

Open another terminal:

```bash
cd rag-service
npm run dev
```

The AI assistant runs on:

```text
http://localhost:5001
```

### Open the Application

Open the following address in your browser:

```text
http://localhost:5173
```

## Demo Accounts

| Role            | Email                                           | Password    |
| --------------- | ----------------------------------------------- | ----------- |
| Caregiver       | [caregiver@test.com](mailto:caregiver@test.com) | password123 |
| Pregnant Mother | [mother@test.com](mailto:mother@test.com)       | password123 |
| Admin           | [admin@test.com](mailto:admin@test.com)         | password123 |

These accounts are intended for development and testing only.

## Project Structure

```text
smartcare/
|
├── backend/
|   ├── config/
|   ├── middleware/
|   ├── models/
|   ├── routes/
|   ├── seed/
|   ├── services/
|   ├── utils/
|   └── server.js
|
├── frontend/
|   ├── public/
|   ├── src/
|   |   ├── api/
|   |   ├── assets/
|   |   ├── components/
|   |   ├── context/
|   |   ├── data/
|   |   ├── hooks/
|   |   ├── pages/
|   |   ├── styles/
|   |   ├── utils/
|   |   ├── App.jsx
|   |   └── main.jsx
|   └── vite.config.js
|
├── rag-service/
|   ├── config/
|   ├── controllers/
|   ├── middleware/
|   ├── models/
|   ├── rag/
|   ├── routes/
|   └── server.js
|
├── .gitignore
├── README.md
└── LICENSE
```

## Available Commands

### Backend

```bash
npm run dev
npm start
npm run seed
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### RAG Service

```bash
npm run dev
npm run ingest
```

## Main API Modules

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

### Users

```text
GET /api/users/me
PUT /api/users/me
```

### Babies

```text
GET    /api/babies
POST   /api/babies
GET    /api/babies/:id
PUT    /api/babies/:id
DELETE /api/babies/:id
```

### Assessments

```text
POST /api/assessments/symptoms
GET  /api/assessments/symptoms

POST /api/assessments/milestones
GET  /api/assessments/milestones

POST /api/assessments/mchat
GET  /api/assessments/mchat
```

### Pregnancy

```text
GET  /api/pregnancy/tracker
POST /api/pregnancy/tracker

GET  /api/pregnancy/kicks
POST /api/pregnancy/kicks

GET  /api/pregnancy/contractions
POST /api/pregnancy/contractions

GET    /api/pregnancy/weight-logs
POST   /api/pregnancy/weight-logs
DELETE /api/pregnancy/weight-logs/:id
```

### Public Information

```text
GET /api/specialists
GET /api/education
GET /api/education/categories
GET /api/emergency-contacts
GET /api/growth
GET /api/vaccinations
```

## Database Models

User
Baby
BabyNote
SymptomConfig
SymptomAssessment
MilestoneConfig
MilestoneAssessment
MchatQuestion
MchatAssessment
GrowthRecord
VaccinationSchedule
VaccinationRecord
PregnancyTracker
Specialist
SpecialtyMapping
EducationArticle
EmergencyContact
RiskThreshold
Notification
ChatSession
ChatMessage

## User Roles

### Caregiver

Can access the dashboard, baby profiles, assessments, growth records, vaccinations, specialists, education, emergency information, and AI assistant.

### Pregnant Mother

Has all caregiver features plus pregnancy tracking, kick counting, contraction tracking, and pregnancy weight logging.

### Admin

Can access analytics, user management, content management, assessment review, system settings, and caregiver-level features.

## Database Seeding

To populate the database with development data:

```bash
cd backend
npm run seed
```

The seed process creates demo users and sample data for babies, symptoms, milestones, M-CHAT questions, growth records, vaccinations, specialists, articles, emergency contacts, and risk thresholds.

## Reset the Database

To completely reset the local database:

```bash
mongosh mongodb://127.0.0.1:27017/smartcare
```

Then:

```text
db.dropDatabase()
exit
```

After that, seed the database again:

```bash
cd backend
npm run seed
```

## Troubleshooting

### Frontend remains on Loading

Make sure the backend is running.

### MongoDB connection error

Start MongoDB:

```bash
brew services start mongodb-community
```

### Port 5000 already in use

```bash
lsof -ti :5000 | xargs kill -9
```

### Vite starts on another port

Stop the existing Vite process and restart the frontend.

### Login returns 401

Check the login credentials and run:

```bash
npm run seed
```

### Environment changes are not detected

Restart the frontend after modifying `.env`.

### Import error

Check the file path shown in the Vite error message and confirm that the required file exists.

## Future Improvements

Server-side PDF generation

Real SMS and email notifications

Pagination for administrator lists

Improved toast notifications

Password reset through email

Two-factor authentication for administrators

Automated testing

Docker Compose setup

GitHub Actions CI/CD

Deployment documentation

Sinhala and Tamil language support

Offline-first PWA support

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Commit your changes with a clear message.
5. Push the branch to GitHub.
6. Create a Pull Request.

Example:

```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add new feature"
git push origin feature/your-feature
```

## License

This project is licensed under the MIT License.

See the LICENSE file for more information.

## Acknowledgements

World Health Organization

American Academy of Pediatrics

American College of Obstetricians and Gynecologists

Institute of Medicine

eChannelling

Lady Ridgeway Hospital for Children


Project Repository: https://github.com/Prasadeni/SmartCare-Baby

Made with care for mothers, babies, and caregivers in Sri Lanka 🇱🇰
