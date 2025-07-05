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

export const useTableData = (tableId: string) => {
  const [table, setTable] = useState<Table | null>(null);
  const [cells, setCells] = useState<Cell[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tableResponse, cellsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/tables/${tableId}`),
          axios.get(`${apiUrl}/api/tables/${tableId}/cells`)
        ]);

        setTable(tableResponse.data);
        setCells(cellsResponse.data);
      } catch (error) {
        console.error('Error fetching table data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (tableId) {
      fetchData();
    }
  }, [tableId, apiUrl]);

  const updateCell = async (cellId: string, value: any) => {
    try {
      const response = await axios.put(`${apiUrl}/api/cells/${cellId}`, { value });
      
      // ローカル状態を更新
      setCells(prevCells => 
        prevCells.map(cell => 
          cell._id === cellId ? { ...cell, value } : cell
        )
      );

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