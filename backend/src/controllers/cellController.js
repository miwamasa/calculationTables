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
        { new: true, upsert: true }
      );
      
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

  async updateOrCreateCell(req, res) {
    try {
      const { tableId, rowId, columnId } = req.params;
      const { value, type } = req.body;
      
      const cell = await Cell.findOneAndUpdate(
        { table_id: tableId, row_id: rowId, column_id: columnId },
        { 
          value, 
          type: type || 'string',
          updated_at: new Date() 
        },
        { new: true, upsert: true }
      );
      
      res.json(cell);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createSampleData(req, res) {
    try {
      const { tableId } = req.params;
      const Table = require('../models/Table');
      
      // テーブル情報を取得
      const table = await Table.findById(tableId);
      if (!table) {
        return res.status(404).json({ error: 'Table not found' });
      }
      
      // 既存のセルを削除
      await Cell.deleteMany({ table_id: tableId });
      
      // テーブルの列情報を使用してサンプルデータを作成
      const sampleCells = [];
      for (let row = 1; row <= 5; row++) {
        table.columns.forEach((column, colIndex) => {
          let value = '';
          let type = column.type;
          
          if (column.type === 'string') {
            value = `商品${row}`;
          } else if (column.type === 'number') {
            if (colIndex === 1) { // 単価
              value = 1000 + (row * 100);
            } else if (colIndex === 2) { // 数量
              value = row * 2;
            } else if (colIndex === 3) { // 合計
              value = (1000 + (row * 100)) * (row * 2);
            }
          } else if (column.type === 'formula') {
            value = (1000 + (row * 100)) * (row * 2);
            type = 'number'; // 計算結果は数値
          }
          
          sampleCells.push({
            table_id: tableId,
            row_id: `row_${row}`,
            column_id: column.id,
            value: value,
            type: type
          });
        });
      }
      
      const createdCells = await Cell.insertMany(sampleCells);
      res.json(createdCells);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new CellController();