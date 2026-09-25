// rag-service/server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const babyRoutes = require("./routes/babyRoutes");
const assistantGenericRoutes = require("./rag/assistantGenericRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Security + parsers
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "baby-care-rag-assistant",
    time: new Date().toISOString(),
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/babies", babyRoutes);
app.use("/api/assistant", assistantGenericRoutes);

// 404 handler — inline
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Error handler — inline
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(err.status || err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

// Start
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`RAG service running on http://localhost:${PORT}`);
  console.log(`CORS allows: ${process.env.CLIENT_ORIGIN}`);
});
