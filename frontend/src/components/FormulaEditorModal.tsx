import React, { useState, useEffect } from 'react';

interface Formula {
  _id: string;
  name: string;
  description?: string;
  expression: any;
}

interface FormulaEditorModalProps {
  formula: Formula | null;
  isOpen: boolean;
  onSave: (formulaData: {
    name: string;
    description?: string;
    expression: any;
  }) => void;
  onCancel: () => void;
}

export const FormulaEditorModal: React.FC<FormulaEditorModalProps> = ({
  formula,
  isOpen,
  onSave,
  onCancel
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expression, setExpression] = useState('');

  useEffect(() => {
    if (formula) {
      setName(formula.name);
      setDescription(formula.description || '');
      setExpression(JSON.stringify(formula.expression, null, 2));
    } else {
      setName('');
      setDescription('');
      setExpression('{\n  "type": "add",\n  "operands": [\n    { "type": "constant", "value": 1 },\n    { "type": "constant", "value": 1 }\n  ]\n}');
    }
  }, [formula]);

  const handleSave = () => {
    try {
      const parsedExpression = JSON.parse(expression);
      onSave({
        name,
        description: description || undefined,
        expression: parsedExpression
      });
    } catch (error) {
      alert('数式の形式が正しくありません。有効なJSONを入力してください。');
    }
  };

  if (!isOpen) return null;

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
        padding: '30px',
        borderRadius: '8px',
        width: '600px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0',
          fontSize: '20px',
          color: '#333'
        }}>
          {formula ? '数式を編集' : '新しい数式を作成'}
        </h3>

        {/* 数式名 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555'
          }}>
            数式名 <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="数式の名前を入力"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* 説明 */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555'
          }}>
            説明
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="数式の説明（任意）"
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
        </div>

        {/* 数式定義 */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#555'
          }}>
            数式定義 (JSON形式) <span style={{ color: '#dc3545' }}>*</span>
          </label>
          <textarea
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="数式をJSON形式で定義"
            style={{
              width: '100%',
              height: '200px',
              padding: '10px',
              border: '1px solid #ced4da',
              borderRadius: '4px',
              fontSize: '13px',
              fontFamily: 'Consolas, Monaco, monospace',
              resize: 'vertical'
            }}
          />
          <div style={{
            fontSize: '12px',
            color: '#6c757d',
            marginTop: '8px'
          }}>
            例: {"{"}"type": "add", "operands": [{"{"}"type": "constant", "value": 10{"}"}, {"{"}"type": "cell", "reference": "A1"{"}"}]{"}"}
          </div>
        </div>

        {/* ボタン */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            キャンセル
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: name.trim() ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: name.trim() ? 'pointer' : 'not-allowed',
              fontSize: '14px'
            }}
          >
            {formula ? '更新' : '作成'}
          </button>
        </div>
      </div>
    </div>
  );
};