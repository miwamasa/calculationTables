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
        console.log('No tableId provided');
        setTable(null);
        setCells([]);
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching data for table:', tableId);
        setLoading(true);
        
        const tableUrl = `${apiUrl}/api/tables/${tableId}`;
        const cellsUrl = `${apiUrl}/api/tables/${tableId}/cells`;
        
        console.log('Table URL:', tableUrl);
        console.log('Cells URL:', cellsUrl);
        
        const [tableResponse, cellsResponse] = await Promise.all([
          axios.get(tableUrl),
          axios.get(cellsUrl)
        ]);

        console.log('Table response:', tableResponse.data);
        console.log('Cells response:', cellsResponse.data);

        setTable(tableResponse.data);
        setCells(cellsResponse.data);
      } catch (error: unknown) {
        console.error('Error fetching table data:', error);
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as any;
          console.error('Response status:', axiosError.response?.status);
          console.error('Response data:', axiosError.response?.data);
        }
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
    } catch (error: unknown) {
      console.error('Error updating cell:', error);
      throw error;
    }
  };

  const addRow = async (tableId: string) => {
    try {
      console.log('addRow called with tableId:', tableId);
      console.log('API URL:', `${apiUrl}/api/tables/${tableId}/rows`);
      
      const response = await axios.post(`${apiUrl}/api/tables/${tableId}/rows`);
      console.log('addRow API response:', response.data);
      
      const newCells = response.data;
      
      setCells(prevCells => {
        const updatedCells = [...prevCells, ...newCells];
        console.log('Updated cells after row addition:', updatedCells.length);
        return updatedCells;
      });
      
      return newCells;
    } catch (error: unknown) {
      console.error('Error adding row:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Response status:', axiosError.response?.status);
        console.error('Response data:', axiosError.response?.data);
      }
      throw error;
    }
  };

  const deleteRow = async (tableId: string, rowId: string) => {
    try {
      await axios.delete(`${apiUrl}/api/tables/${tableId}/rows/${rowId}`);
      
      setCells(prevCells => prevCells.filter(cell => 
        !(cell.table_id === tableId && cell.row_id === rowId)
      ));
    } catch (error: unknown) {
      console.error('Error deleting row:', error);
      throw error;
    }
  };

  const refreshData = async () => {
    if (tableId) {
      try {
        setLoading(true);
        const [tableResponse, cellsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/tables/${tableId}`),
          axios.get(`${apiUrl}/api/tables/${tableId}/cells`)
        ]);
        
        setTable(tableResponse.data);
        setCells(cellsResponse.data);
      } catch (error: unknown) {
        console.error('Error refreshing data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    table,
    cells,
    loading,
    updateCell,
    addRow,
    deleteRow,
    refreshData
  };
};