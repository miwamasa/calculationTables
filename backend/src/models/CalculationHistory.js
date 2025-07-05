const mongoose = require('mongoose');

const calculationHistorySchema = new mongoose.Schema({
  table_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  row_id: {
    type: String,
    required: true
  },
  column_id: {
    type: String,
    required: true
  },
  formula_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Formula',
    required: true
  },
  formula_name: {
    type: String,
    required: true
  },
  formula_expression: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  calculated_value: {
    type: Number,
    required: true
  },
  applied_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CalculationHistory', calculationHistorySchema);