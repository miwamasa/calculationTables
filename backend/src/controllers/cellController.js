const Cell = require('../models/Cell');

class CellController {
  async createCell(req, res) {
    try {
      const { table_id, row_id, column_id, value, type, formula_id } = req.body;
      
      const cell = new Cell({
        table_id,
        row_id,
        column_id,
        value,
        type,
        formula_id
      });
      
      await cell.save();
      
      res.status(201).json(cell);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCell(req, res) {
    try {
      const { id } = req.params;
      const cell = await Cell.findById(id).populate('formula_id');
      
      if (!cell) {
        return res.status(404).json({ error: 'Cell not found' });
      }
      
      res.json(cell);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateCell(req, res) {
    try {
      const { id } = req.params;
      const { value, type, formula_id } = req.body;
      
      const cell = await Cell.findByIdAndUpdate(
        id,
        { 
          value, 
          type, 
          formula_id,
          updated_at: new Date() 
        },
        { new: true }
      );
      
      if (!cell) {
        return res.status(404).json({ error: 'Cell not found' });
      }
      
      res.json(cell);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteCell(req, res) {
    try {
      const { id } = req.params;
      
      const cell = await Cell.findByIdAndDelete(id);
      
      if (!cell) {
        return res.status(404).json({ error: 'Cell not found' });
      }
      
      res.json({ message: 'Cell deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCellsByTable(req, res) {
    try {
      const { tableId } = req.params;
      const cells = await Cell.find({ table_id: tableId }).populate('formula_id');
      
      res.json(cells);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CellController();