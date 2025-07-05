import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CalculationHistory {
  _id: string;
  table_id: string;
  row_id: string;
  column_id: string;
  formula_id: string;
  formula_name: string;
  formula_expression: any;
  calculated_value: number;
  applied_at: string;
}

interface CalculationHistoryProps {
  tableId: string | null;
  isVisible: boolean;
  onClose: () => void;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  tableId,
  isVisible,
  onClose
}) => {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [loading, setLoading] = useState(false);
  
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (isVisible && tableId) {
      fetchHistory();
    }
  }, [isVisible, tableId]);

  const fetchHistory = async () => {
    if (!tableId) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/api/tables/${tableId}/calculation-history`);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching calculation history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatExpression = (expression: any): string => {
    if (!expression) return '';
    
    switch (expression.type) {
      case 'multiply':
        return `${formatOperand(expression.operands[0])} × ${formatOperand(expression.operands[1])}`;
      case 'add':
        return expression.operands.map(formatOperand).join(' + ');
      case 'subtract':
        return expression.operands.map(formatOperand).join(' - ');
      case 'divide':
        return expression.operands.map(formatOperand).join(' ÷ ');
      default:
        return JSON.stringify(expression);
    }
  };

  const formatOperand = (operand: any): string => {
    if (operand.type === 'cell_reference') {
      return operand.column;
    } else if (operand.type === 'constant') {
      return operand.value.toString();
    }
    return JSON.stringify(operand);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80%',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{ margin: 0 }}>計算履歴</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            読み込み中...
          </div>
        ) : (
          <div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                計算履歴がありません
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                      セル
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                      数式名
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                      計算式
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                      結果
                    </th>
                    <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                      適用日時
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item._id}>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                        {item.row_id}:{item.column_id}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                        {item.formula_name}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                        {formatExpression(item.formula_expression)}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                        {item.calculated_value}
                      </td>
                      <td style={{ padding: '12px', border: '1px solid #dee2e6' }}>
                        {new Date(item.applied_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};