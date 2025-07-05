import React from 'react';
import { SpreadsheetGrid } from './components/SpreadsheetGrid';
import { FormulaEditor } from './components/FormulaEditor';
import './App.css';

function App() {
  const [selectedCellId, setSelectedCellId] = React.useState<string>('');
  const [showFormulaEditor, setShowFormulaEditor] = React.useState(false);

  const handleFormulaSave = (formula: any) => {
    console.log('Formula saved:', formula);
    setShowFormulaEditor(false);
  };

  return (
    <div className="App" style={{ padding: '20px' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1>データベース駆動型スプレッドシートシステム</h1>
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={() => setShowFormulaEditor(!showFormulaEditor)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {showFormulaEditor ? '数式エディターを閉じる' : '数式エディターを開く'}
          </button>
        </div>
      </header>

      {showFormulaEditor && (
        <div style={{ marginBottom: '20px', border: '1px solid #ddd', padding: '15px', borderRadius: '4px' }}>
          <h3>数式エディター</h3>
          <FormulaEditor
            cellId={selectedCellId || 'demo'}
            initialFormula="=A1*B1"
            onSave={handleFormulaSave}
          />
        </div>
      )}

      <div style={{ height: '500px', width: '100%' }}>
        <SpreadsheetGrid tableId="demo-table" />
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>システム状態</h4>
        <p>バックエンド: http://localhost:3001</p>
        <p>MongoDB & Redis: Docker Compose で起動</p>
        <p>現在はデモモードです。実際のテーブルデータを表示するには、バックエンドAPIでテーブルを作成してください。</p>
      </div>
    </div>
  );
}

export default App;
