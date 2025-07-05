const Table = require('../models/Table');
const Cell = require('../models/Cell');

class TableController {
  async createTable(req, res) {
    try {
      const { name, description, columns } = req.body;
      
      const table = new Table({
        name,
        description,
        columns
      });
      
      await table.save();
      
      res.status(201).json(table);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTable(req, res) {
    try {
      const { id } = req.params;
      const table = await Table.findById(id);
      
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
      
      res.json(table);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllTables(req, res) {
    try {
      const tables = await Table.find();
      res.json(tables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTableCells(req, res) {
    try {
      const { id } = req.params;
      const cells = await Cell.find({ table_id: id });
      res.json(cells);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateTable(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const table = await Table.findByIdAndUpdate(
        id, 
        { ...updates, updated_at: new Date() }, 
        { new: true }
      );
      
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
      
      res.json(table);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteTable(req, res) {
    try {
      const { id } = req.params;
      
      // テーブルに関連するセルも削除
      await Cell.deleteMany({ table_id: id });
      
      const table = await Table.findByIdAndDelete(id);
      
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
      
      res.json({ message: 'Table deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TableController();