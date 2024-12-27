const mongoose = require("mongoose");

const bmiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  bmi: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["Kurus", "Normal", "Gemuk", "Obesitas"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BMI", bmiSchema);
