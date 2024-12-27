const express = require("express");
const router = express.Router();
const BMI = require("../models/Bmi");

// GET /api/bmi/history
router.get("/history", async (req, res) => {
  try {
    console.log("GET /api/bmi/history - Mengambil riwayat BMI");
    const bmiHistory = await BMI.find().sort({ date: -1 });
    console.log(`Berhasil mengambil ${bmiHistory.length} data BMI`);
    res.json(bmiHistory);
  } catch (error) {
    console.error("Error saat mengambil riwayat BMI:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat BMI",
      error: error.message,
    });
  }
});

// POST /api/bmi/calculate
router.post("/calculate", async (req, res) => {
  try {
    const { name, height, weight } = req.body;
    console.log("POST /api/bmi/calculate - Data diterima:", {
      name,
      height,
      weight,
    });

    // Validasi input
    if (!name || !height || !weight) {
      return res.status(400).json({
        success: false,
        message: "Nama, tinggi, dan berat badan harus diisi",
      });
    }

    if (height <= 0 || weight <= 0) {
      return res.status(400).json({
        success: false,
        message: "Tinggi dan berat badan harus lebih dari 0",
      });
    }

    // Hitung BMI
    const heightInM = height / 100;
    const bmi = weight / (heightInM * heightInM);

    // Tentukan kategori
    let category;
    if (bmi < 18.5) category = "Kurus";
    else if (bmi < 25) category = "Normal";
    else if (bmi < 30) category = "Gemuk";
    else category = "Obesitas";

    const newBMI = new BMI({
      name,
      height,
      weight,
      bmi: parseFloat(bmi.toFixed(2)),
      category,
      date: new Date(),
    });

    const savedBMI = await newBMI.save();
    console.log("BMI berhasil disimpan:", savedBMI);

    res.status(201).json({
      success: true,
      message: "BMI berhasil dihitung dan disimpan",
      data: savedBMI,
    });
  } catch (error) {
    console.error("Error saat menghitung/menyimpan BMI:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghitung/menyimpan BMI",
      error: error.message,
    });
  }
});

// PUT /api/bmi/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(`PUT /api/bmi/${id} - Data update:`, updateData);

    // Validasi ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID BMI tidak valid",
      });
    }

    const updatedBMI = await BMI.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBMI) {
      return res.status(404).json({
        success: false,
        message: "Data BMI tidak ditemukan",
      });
    }

    console.log("BMI berhasil diupdate:", updatedBMI);
    res.json({
      success: true,
      message: "BMI berhasil diupdate",
      data: updatedBMI,
    });
  } catch (error) {
    console.error("Error saat mengupdate BMI:", error);
    res.status(500).json({
      success: false,
      message: "Gagal mengupdate BMI",
      error: error.message,
    });
  }
});

// DELETE /api/bmi/:id
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`DELETE /api/bmi/${id}`);

    // Validasi ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "ID BMI tidak valid",
      });
    }

    const deletedBMI = await BMI.findByIdAndDelete(id);
    if (!deletedBMI) {
      return res.status(404).json({
        success: false,
        message: "Data BMI tidak ditemukan",
      });
    }

    console.log("BMI berhasil dihapus");
    res.json({
      success: true,
      message: "BMI berhasil dihapus",
      data: deletedBMI,
    });
  } catch (error) {
    console.error("Error saat menghapus BMI:", error);
    res.status(500).json({
      success: false,
      message: "Gagal menghapus BMI",
      error: error.message,
    });
  }
});

module.exports = router;
