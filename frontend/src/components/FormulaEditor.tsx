import React from 'react';
import { useFormula } from '../hooks/useFormula';

interface FormulaEditorProps {
  cellId: string;
  initialFormula?: string;
  onSave: (formula: any) => void;
}

export const FormulaEditor: React.FC<FormulaEditorProps> = ({ 
  cellId, 
  initialFormula, 
  onSave 
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
      setErrors([error.message]);
    }
  };

  return (
    <div className="formula-editor">
      <textarea
        value={formula}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Enter formula..."
        rows={5}
        cols={50}
        style={{
          width: '100%',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '14px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      {errors.length > 0 && (
        <div className="errors" style={{ color: 'red', marginTop: '8px' }}>
          {errors.map((error, i) => (
            <div key={i} className="error">{error}</div>
          ))}
        </div>
      )}
      <button 
        onClick={handleSave} 
        disabled={errors.length > 0}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          backgroundColor: errors.length > 0 ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: errors.length > 0 ? 'not-allowed' : 'pointer'
        }}
      >
        Save Formula
      </button>
    </div>
  );
};