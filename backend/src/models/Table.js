const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  columns: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['string', 'number', 'date', 'formula'], required: true },
    format: String,
    width: { type: Number, default: 150 },
    formula: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' }
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Table', tableSchema);