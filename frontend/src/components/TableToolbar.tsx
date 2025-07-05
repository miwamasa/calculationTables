import React from 'react';

interface TableToolbarProps {
  tableName: string;
  onAddRow: () => void;
  onDeleteRow: () => void;
  onRefresh: () => void;
  selectedRowCount: number;
}

export const TableToolbar: React.FC<TableToolbarProps> = ({
  tableName,
  onAddRow,
  onDeleteRow,
  onRefresh,
  selectedRowCount
}) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 16px',
      backgroundColor: '#f8f9fa',
      borderBottom: '1px solid #e9ecef',
      minHeight: '48px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <h3 style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: '600',
          color: '#212529'
        }}>
          📊 {tableName}
        </h3>
        <div style={{
          fontSize: '12px',
          color: '#6c757d'
        }}>
          {selectedRowCount > 0 && `${selectedRowCount}行選択中`}
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '8px'
      }}>
        <button
          onClick={() => {
            console.log('行追加ボタンがクリックされました');
            onAddRow();
          }}
          style={{
            padding: '6px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          ➕ 行追加
        </button>
        
        <button
          onClick={onDeleteRow}
          disabled={selectedRowCount === 0}
          style={{
            padding: '6px 12px',
            backgroundColor: selectedRowCount > 0 ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: selectedRowCount > 0 ? 'pointer' : 'not-allowed',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🗑️ 行削除
        </button>
        
        <button
          onClick={onRefresh}
          style={{
            padding: '6px 12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🔄 更新
        </button>
      </div>
    </div>
  );
};