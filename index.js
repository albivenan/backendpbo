const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bmiRoutes = require("./routes/bmiRoutes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi MongoDB
mongoose
  .connect("mongodb+srv://123:123@pbo.lnzhl.mongodb.net/?retryWrites=true&w=majority&appName=pbo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Terhubung ke MongoDB");
  })
  .catch((error) => {
    console.error("Error koneksi MongoDB:", error);
    process.exit(1);
  });

// Routes
app.get("/", (req, res) => {
  res.json({ message: "BMI Calculator API berjalan" });
});

// BMI routes
app.use("/api/bmi", bmiRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Terjadi kesalahan pada server",
    error: err.message,
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});
