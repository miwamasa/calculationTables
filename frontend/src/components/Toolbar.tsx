import React from 'react';

interface ToolbarProps {
  selectedTableName?: string;
  onSave: () => void;
  onNewTable: () => void;
  onSettings: () => void;
  onFormulaEditor: () => void;
  isFormulaEditorOpen: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedTableName,
  onSave,
  onNewTable,
  onSettings,
  onFormulaEditor,
  isFormulaEditorOpen
}) => {
  return (
    <div style={{
      height: '50px',
      backgroundColor: '#343a40',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      padding: '0 20px',
      borderBottom: '1px solid #dee2e6'
    }}>
      {/* ロゴ・タイトル */}
      <div style={{ marginRight: '30px' }}>
        <h3 style={{ margin: 0, fontSize: '18px' }}>
          📊 SpreadSheet System
        </h3>
      </div>

      {/* 選択中のテーブル名 */}
      <div style={{ 
        marginRight: 'auto',
        fontSize: '14px',
        color: '#adb5bd'
      }}>
        {selectedTableName ? `表: ${selectedTableName}` : '表が選択されていません'}
      </div>

      {/* ツールボタン群 */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onSave}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#218838'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
        >
          💾 保存
        </button>

        <button
          onClick={onNewTable}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          ➕ 新規表
        </button>

        <button
          onClick={onFormulaEditor}
          style={{
            padding: '8px 16px',
            backgroundColor: isFormulaEditorOpen ? '#ffc107' : '#6c757d',
            color: isFormulaEditorOpen ? '#212529' : 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            if (isFormulaEditorOpen) {
              e.currentTarget.style.backgroundColor = '#e0a800';
            } else {
              e.currentTarget.style.backgroundColor = '#5a6268';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isFormulaEditorOpen ? '#ffc107' : '#6c757d';
          }}
        >
          🧮 数式エディタ
        </button>

        <button
          onClick={onSettings}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
        >
          ⚙️ 設定
        </button>
      </div>
    </div>
  );
};