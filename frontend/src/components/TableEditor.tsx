import React, { useState } from 'react';

interface Column {
  id: string;
  name: string;
  type: string;
  width?: number;
  format?: string;
}

interface Table {
  _id: string;
  name: string;
  description?: string;
  columns: Column[];
}

interface TableEditorProps {
  table: Table;
  onSave: (updatedTable: Partial<Table>) => void;
  onAddColumn: () => void;
  onDeleteColumn: (columnId: string) => void;
  onClose: () => void;
}

export const TableEditor: React.FC<TableEditorProps> = ({
  table,
  onSave,
  onAddColumn,
  onDeleteColumn,
  onClose
}) => {
  const [editedTable, setEditedTable] = useState<Table>({ ...table });

  const handleTableChange = (field: keyof Table, value: any) => {
    setEditedTable(prev => ({ ...prev, [field]: value }));
  };

  const handleColumnChange = (columnId: string, field: keyof Column, value: any) => {
    setEditedTable(prev => ({
      ...prev,
      columns: prev.columns.map(col => 
        col.id === columnId ? { ...col, [field]: value } : col
      )
    }));
  };

  const handleSave = () => {
    onSave(editedTable);
    onClose();
  };

  const addNewColumn = () => {
    const newColumn: Column = {
      id: `col_${Date.now()}`,
      name: '新しい列',
      type: 'string',
      width: 150
    };
    
    setEditedTable(prev => ({
      ...prev,
      columns: [...prev.columns, newColumn]
    }));
  };

  const deleteColumn = (columnId: string) => {
    if (editedTable.columns.length <= 1) {
      alert('最低1つの列が必要です');
      return;
    }
    
    setEditedTable(prev => ({
      ...prev,
      columns: prev.columns.filter(col => col.id !== columnId)
    }));
  };

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
        borderRadius: '8px',
        padding: '24px',
        maxWidth: '800px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: 0 }}>テーブル編集: {table.name}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6c757d'
            }}
          >
            ×
          </button>
        </div>

        {/* テーブル基本情報 */}
        <div style={{ marginBottom: '24px' }}>
          <h4>基本情報</h4>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              テーブル名:
            </label>
            <input
              type="text"
              value={editedTable.name}
              onChange={(e) => handleTableChange('name', e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px'
              }}
            />
          </div>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              説明:
            </label>
            <textarea
              value={editedTable.description || ''}
              onChange={(e) => handleTableChange('description', e.target.value)}
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ced4da',
                borderRadius: '4px',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        {/* 列設定 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}>
            <h4 style={{ margin: 0 }}>列設定</h4>
            <button
              onClick={addNewColumn}
              style={{
                padding: '6px 12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              + 列を追加
            </button>
          </div>
          
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            {editedTable.columns.map((column, index) => (
              <div
                key={column.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '12px',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  marginBottom: '8px',
                  backgroundColor: '#f8f9fa'
                }}
              >
                <div style={{ flex: 1 }}>
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) => handleColumnChange(column.id, 'name', e.target.value)}
                    placeholder="列名"
                    style={{
                      width: '100%',
                      padding: '4px 8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <select
                    value={column.type}
                    onChange={(e) => handleColumnChange(column.id, 'type', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '4px 8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="string">文字列</option>
                    <option value="number">数値</option>
                    <option value="date">日付</option>
                    <option value="formula">数式</option>
                  </select>
                </div>
                <div style={{ width: '80px' }}>
                  <input
                    type="number"
                    value={column.width || 150}
                    onChange={(e) => handleColumnChange(column.id, 'width', parseInt(e.target.value))}
                    placeholder="幅"
                    style={{
                      width: '100%',
                      padding: '4px 8px',
                      border: '1px solid #ced4da',
                      borderRadius: '4px'
                    }}
                  />
                </div>
                <button
                  onClick={() => deleteColumn(column.id)}
                  disabled={editedTable.columns.length <= 1}
                  style={{
                    padding: '4px 8px',
                    backgroundColor: editedTable.columns.length <= 1 ? '#6c757d' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: editedTable.columns.length <= 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* アクションボタン */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};