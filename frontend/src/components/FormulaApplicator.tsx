import React, { useState } from 'react';

interface Formula {
  _id: string;
  name: string;
  description?: string;
  expression: any;
}

interface FormulaApplicatorProps {
  formulas: Formula[];
  selectedCellId: string;
  onApplyFormula: (formulaId: string, cellId: string) => void;
  isVisible: boolean;
}

export const FormulaApplicator: React.FC<FormulaApplicatorProps> = ({
  formulas,
  selectedCellId,
  onApplyFormula,
  isVisible
}) => {
  const [selectedFormulaId, setSelectedFormulaId] = useState<string>('');

  const handleApply = () => {
    if (selectedFormulaId && selectedCellId) {
      onApplyFormula(selectedFormulaId, selectedCellId);
      setSelectedFormulaId('');
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      height: '180px',
      backgroundColor: '#e8f5e8',
      borderTop: '1px solid #28a745',
      padding: '15px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h4 style={{ margin: 0, fontSize: '16px', color: '#155724' }}>
          🧮 数式適用 - セル: {selectedCellId}
        </h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleApply} 
            disabled={!selectedFormulaId}
            style={{
              padding: '6px 12px',
              backgroundColor: selectedFormulaId ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedFormulaId ? 'pointer' : 'not-allowed',
              fontSize: '14px'
            }}
          >
            ✅ 適用
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '15px' }}>
        {/* 数式選択エリア */}
        <div style={{ flex: 2 }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#155724'
          }}>
            適用する数式を選択:
          </label>
          <select
            value={selectedFormulaId}
            onChange={(e) => setSelectedFormulaId(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #28a745',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white'
            }}
          >
            <option value="">数式を選択してください</option>
            {formulas.map(formula => (
              <option key={formula._id} value={formula._id}>
                {formula.name} {formula.description && `(${formula.description})`}
              </option>
            ))}
          </select>
        </div>

        {/* 数式プレビューエリア */}
        <div style={{ flex: 1, fontSize: '12px' }}>
          {selectedFormulaId ? (
            <div>
              <strong style={{ color: '#155724' }}>数式プレビュー:</strong>
              <div style={{ 
                color: '#155724', 
                marginTop: '5px',
                backgroundColor: 'white',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #28a745',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '11px',
                maxHeight: '80px',
                overflow: 'auto'
              }}>
                {(() => {
                  const formula = formulas.find(f => f._id === selectedFormulaId);
                  return formula ? JSON.stringify(formula.expression, null, 2) : '';
                })()}
              </div>
            </div>
          ) : (
            <div>
              <strong style={{ color: '#6c757d' }}>使用方法:</strong>
              <div style={{ color: '#6c757d', marginTop: '5px' }}>
                <div>1. セルをクリックして選択</div>
                <div>2. 適用したい数式を選択</div>
                <div>3. 「適用」ボタンをクリック</div>
                <div>4. 数式が計算されて結果が表示</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};