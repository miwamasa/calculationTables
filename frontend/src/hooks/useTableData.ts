import { useState, useEffect } from 'react';
import axios from 'axios';

interface Table {
  _id: string;
  name: string;
  columns: Array<{
    id: string;
    name: string;
    type: string;
    width: number;
  }>;
}

interface Cell {
  _id: string;
  table_id: string;
  row_id: string;
  column_id: string;
  value: any;
  type: string;
}

export const useTableData = (tableId: string | null) => {
  const [table, setTable] = useState<Table | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      if (!tableId) {
        setTable(null);
        setCells([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [tableResponse, cellsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/tables/${tableId}`),
          axios.get(`${apiUrl}/api/tables/${tableId}/cells`)
        ]);

        setTable(tableResponse.data);
        setCells(cellsResponse.data);
      } catch (error) {
        console.error('Error fetching table data:', error);
        setTable(null);
        setCells([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableId, apiUrl]);

  const updateCell = async (tableId: string, rowId: string, columnId: string, value: any) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/tables/${tableId}/cells/${rowId}/${columnId}`, 
        { value, type: typeof value === 'number' ? 'number' : 'string' }
      );
      
      // ローカル状態を更新
      setCells(prevCells => {
        const updatedCells = prevCells.map(cell => 
          cell.table_id === tableId && cell.row_id === rowId && cell.column_id === columnId
            ? { ...cell, value }
            : cell
        );
        
        // セルが存在しない場合は新規追加
        const cellExists = prevCells.some(cell => 
          cell.table_id === tableId && cell.row_id === rowId && cell.column_id === columnId
        );
        
        if (!cellExists) {
          updatedCells.push({
            _id: response.data._id,
            table_id: tableId,
            row_id: rowId,
            column_id: columnId,
            value: value,
            type: typeof value === 'number' ? 'number' : 'string'
          });
        }
        
        return updatedCells;
      });

      return response.data;
    } catch (error) {
      console.error('Error updating cell:', error);
      throw error;
    }
  };

  return {
    table,
    cells,
    loading,
    updateCell
  };
};