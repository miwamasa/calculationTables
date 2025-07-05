const mongoose = require('mongoose');

const formulaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  expression: { type: Object, required: true }, // JSON形式の計算式
  parameters: [{ type: String }],
  is_template: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Formula', formulaSchema);