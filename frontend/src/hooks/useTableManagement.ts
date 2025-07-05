import { useState, useEffect } from 'react';
import axios from 'axios';

interface Table {
  _id: string;
  name: string;
  description?: string;
  columns: Array<{
    id: string;
    name: string;
    type: string;
    width?: number;
    format?: string;
  }>;
}

interface Formula {
  _id: string;
  name: string;
  description?: string;
  expression: any;
}

export const useTableManagement = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [tablesResponse, formulasResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/tables`),
          axios.get(`${apiUrl}/api/formulas`)
        ]);

        setTables(tablesResponse.data);
        setFormulas(formulasResponse.data);
        setError(null);
      } catch (err) {
        setError('データの取得に失敗しました');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  // テーブル作成
  const createTable = async (tableData: {
    name: string;
    description?: string;
    columns: Array<{
      id: string;
      name: string;
      type: string;
      width?: number;
      format?: string;
    }>;
  }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/tables`, tableData);
      setTables(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating table:', err);
      throw err;
    }
  };

  // 数式作成
  const createFormula = async (formulaData: {
    name: string;
    description?: string;
    expression: any;
    parameters?: string[];
    is_template?: boolean;
  }) => {
    try {
      const response = await axios.post(`${apiUrl}/api/formulas`, formulaData);
      setFormulas(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating formula:', err);
      throw err;
    }
  };

  // テーブル更新
  const updateTable = async (tableId: string, updates: Partial<Table>) => {
    try {
      const response = await axios.put(`${apiUrl}/api/tables/${tableId}`, updates);
      setTables(prev => prev.map(table => 
        table._id === tableId ? response.data : table
      ));
      return response.data;
    } catch (err) {
      console.error('Error updating table:', err);
      throw err;
    }
  };

  // テーブル削除
  const deleteTable = async (tableId: string) => {
    try {
      await axios.delete(`${apiUrl}/api/tables/${tableId}`);
      setTables(prev => prev.filter(table => table._id !== tableId));
    } catch (err) {
      console.error('Error deleting table:', err);
      throw err;
    }
  };

  // サンプルデータ作成
  const createSampleData = async (tableId: string) => {
    try {
      const response = await axios.post(`${apiUrl}/api/tables/${tableId}/sample-data`);
      return response.data;
    } catch (err) {
      console.error('Error creating sample data:', err);
      throw err;
    }
  };

  return {
    tables,
    formulas,
    loading,
    error,
    createTable,
    createFormula,
    updateTable,
    deleteTable,
    createSampleData
  };
};