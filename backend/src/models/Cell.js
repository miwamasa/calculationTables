const mongoose = require('mongoose');

const cellSchema = new mongoose.Schema({
  table_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  row_id: { type: String, required: true },
  column_id: { type: String, required: true },
  value: mongoose.Schema.Types.Mixed,
  type: { type: String, enum: ['string', 'number', 'date', 'formula'], required: true },
  formula_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Formula' },
  dependencies: [{ type: String }],  // Array of cell IDs
  dependents: [{ type: String }],    // Array of cell IDs
  updated_at: { type: Date, default: Date.now }
});

// 複合インデックス for faster queries
cellSchema.index({ table_id: 1, row_id: 1, column_id: 1 }, { unique: true });

module.exports = mongoose.model('Cell', cellSchema);