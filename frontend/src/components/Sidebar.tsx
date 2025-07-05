import React from 'react';

interface Table {
  _id: string;
  name: string;
  description?: string;
}

interface Formula {
  _id: string;
  name: string;
  description?: string;
}

interface SidebarProps {
  tables: Table[];
  formulas: Formula[];
  selectedTableId: string | null;
  selectedFormulaId?: string | null;
  onTableSelect: (tableId: string) => void;
  onFormulaSelect?: (formulaId: string) => void;
  onNewTable: () => void;
  onNewFormula: () => void;
  onDeleteTable: (tableId: string) => void;
  onEditTable: (tableId: string) => void;
  onDeleteFormula?: (formulaId: string) => void;
  onEditFormula?: (formulaId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  tables,
  formulas,
  selectedTableId,
  selectedFormulaId,
  onTableSelect,
  onFormulaSelect,
  onNewTable,
  onNewFormula,
  onDeleteTable,
  onEditTable,
  onDeleteFormula,
  onEditFormula
}) => {
  return (
    <div style={{
      width: '300px',
      backgroundColor: '#f8f9fa',
      borderRight: '1px solid #dee2e6',
      height: '100%',
      overflow: 'auto',
      flexShrink: 0,
      padding: '10px'
    }}>
      {/* 表一覧セクション */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <h4 style={{ margin: 0, fontSize: '16px' }}>表一覧</h4>
          <button
            onClick={onNewTable}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            + 新規
          </button>
        </div>
        
        <div style={{ maxHeight: '200px', overflow: 'auto' }}>
          {tables.length === 0 ? (
            <div style={{ 
              color: '#6c757d', 
              fontSize: '14px',
              textAlign: 'center',
              padding: '20px'
            }}>
              テーブルがありません
            </div>
          ) : (
            tables.map(table => (
              <div
                key={table._id}
                style={{
                  marginBottom: '4px',
                  backgroundColor: selectedTableId === table._id ? '#e3f2fd' : 'white',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
              >
                <div
                  onClick={() => onTableSelect(table._id)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTableId !== table._id) {
                      e.currentTarget.parentElement!.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTableId !== table._id) {
                      e.currentTarget.parentElement!.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {table.name}
                  </div>
                  {table.description && (
                    <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>
                      {table.description}
                    </div>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  padding: '4px 8px',
                  borderTop: '1px solid #dee2e6'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTable(table._id);
                    }}
                    style={{
                      flex: 1,
                      padding: '2px 6px',
                      fontSize: '11px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    編集
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`「${table.name}」を削除しますか？`)) {
                        onDeleteTable(table._id);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '2px 6px',
                      fontSize: '11px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 数式一覧セクション */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <h4 style={{ margin: 0, fontSize: '16px' }}>数式一覧</h4>
          <button
            onClick={onNewFormula}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            + 新規
          </button>
        </div>
        
        <div style={{ maxHeight: '200px', overflow: 'auto' }}>
          {formulas.length === 0 ? (
            <div style={{ 
              color: '#6c757d', 
              fontSize: '14px',
              textAlign: 'center',
              padding: '20px'
            }}>
              数式がありません
            </div>
          ) : (
            formulas.map(formula => (
              <div
                key={formula._id}
                style={{
                  marginBottom: '4px',
                  backgroundColor: selectedFormulaId === formula._id ? '#e8f5e8' : 'white',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  transition: 'background-color 0.2s'
                }}
              >
                <div
                  onClick={() => onFormulaSelect?.(formula._id)}
                  style={{
                    padding: '8px 12px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFormulaId !== formula._id) {
                      e.currentTarget.parentElement!.style.backgroundColor = '#f5f5f5';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFormulaId !== formula._id) {
                      e.currentTarget.parentElement!.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                    {formula.name}
                  </div>
                  {formula.description && (
                    <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '2px' }}>
                      {formula.description}
                    </div>
                  )}
                </div>
                <div style={{
                  display: 'flex',
                  gap: '4px',
                  padding: '4px 8px',
                  borderTop: '1px solid #dee2e6'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditFormula?.(formula._id);
                    }}
                    style={{
                      flex: 1,
                      padding: '2px 6px',
                      fontSize: '11px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    編集
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`「${formula.name}」を削除しますか？`)) {
                        onDeleteFormula?.(formula._id);
                      }
                    }}
                    style={{
                      flex: 1,
                      padding: '2px 6px',
                      fontSize: '11px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '3px',
                      cursor: 'pointer'
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 履歴セクション */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>履歴</h4>
        <div style={{ 
          color: '#6c757d', 
          fontSize: '14px',
          textAlign: 'center',
          padding: '20px'
        }}>
          履歴機能は今後実装予定
        </div>
      </div>
    </div>
  );
};