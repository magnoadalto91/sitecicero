const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// =====================================
// CORS — aceita frontend do Render + local
// =====================================
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // permite Insomnia/curl
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================
// ROTAS
// =====================================
const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/properties");
const imageRoutes = require("./routes/images");

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/property-images", imageRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("API Imobiliária funcionando 🚀");
});

// =====================================
// START
// =====================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
