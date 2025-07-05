import React from 'react';
import { useFormula } from '../hooks/useFormula';

interface FormulaEditorProps {
  cellId: string;
  initialFormula?: string;
  onSave: (formula: any) => void;
  isVisible: boolean;
}

export const FormulaEditor: React.FC<FormulaEditorProps> = ({ 
  cellId, 
  initialFormula, 
  onSave,
  isVisible 
}) => {
  const { parseFormula, validateFormula } = useFormula();
  const [formula, setFormula] = React.useState(initialFormula || '');
  const [errors, setErrors] = React.useState<string[]>([]);

  const handleChange = (value: string) => {
    setFormula(value);
    const validation = validateFormula(value);
    setErrors(validation.errors);
  };

  const handleSave = () => {
    try {
      const parsed = parseFormula(formula);
      onSave(parsed);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : 'Unknown error']);
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      height: '200px',
      backgroundColor: '#f8f9fa',
      borderTop: '1px solid #dee2e6',
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
        <h4 style={{ margin: 0, fontSize: '16px' }}>
          数式エディタ - セル: {cellId}
        </h4>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            onClick={handleSave} 
            disabled={errors.length > 0}
            style={{
              padding: '6px 12px',
              backgroundColor: errors.length > 0 ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: errors.length > 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            💾 適用
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, gap: '15px' }}>
        {/* 数式入力エリア */}
        <div style={{ flex: 2 }}>
          <textarea
            value={formula}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="数式を入力してください（例: =A1*B1, =SUM(A1:A10)）"
            style={{
              width: '100%',
              height: '100%',
              padding: '10px',
              fontFamily: 'Consolas, Monaco, monospace',
              fontSize: '14px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              resize: 'none',
              backgroundColor: 'white'
            }}
          />
        </div>

        {/* ヘルプ・エラー表示エリア */}
        <div style={{ flex: 1, fontSize: '12px' }}>
          {errors.length > 0 ? (
            <div>
              <strong style={{ color: '#dc3545' }}>エラー:</strong>
              <div style={{ color: '#dc3545', marginTop: '5px' }}>
                {errors.map((error, i) => (
                  <div key={i}>• {error}</div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <strong style={{ color: '#28a745' }}>数式のヒント:</strong>
              <div style={{ color: '#6c757d', marginTop: '5px' }}>
                <div>• セル参照: A1, B2</div>
                <div>• 四則演算: +, -, *, /</div>
                <div>• 関数: SUM(), AVERAGE()</div>
                <div>• 条件: IF(条件, 真, 偽)</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};