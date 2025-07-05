import React from 'react';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { TableGrid } from './components/TableGrid';
import { FormulaEditor } from './components/FormulaEditor';
import { useTableManagement } from './hooks/useTableManagement';
import { useTableData } from './hooks/useTableData';
import './App.css';

function App() {
  const [selectedTableId, setSelectedTableId] = React.useState<string | null>(null);
  const [selectedCellId, setSelectedCellId] = React.useState<string>('');
  const [showFormulaEditor, setShowFormulaEditor] = React.useState(false);

  const { tables, formulas, loading: managementLoading, createTable, createFormula } = useTableManagement();
  const { table, cells, loading: tableLoading, updateCell } = useTableData(selectedTableId);

  const selectedTable = tables.find(t => t._id === selectedTableId);

  const handleTableSelect = (tableId: string) => {
    setSelectedTableId(tableId);
    setSelectedCellId('');
  };

  const handleCellEdit = async (cellId: string, newValue: any) => {
    try {
      await updateCell(cellId, newValue);
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  };

  const handleCellSelect = (cellId: string) => {
    setSelectedCellId(cellId);
  };

  const handleFormulaSave = (formula: any) => {
    console.log('Formula saved:', formula);
    // TODO: セルに数式を適用する処理
  };

  const handleSave = () => {
    console.log('Save triggered');
    // TODO: 変更内容を保存する処理
  };

  const handleNewTable = () => {
    // デモ用のテーブル作成
    const newTable = {
      name: `新しい表 ${tables.length + 1}`,
      description: '自動生成された表',
      columns: [
        { id: 'col_1', name: '列A', type: 'string', width: 150 },
        { id: 'col_2', name: '列B', type: 'number', width: 120 },
        { id: 'col_3', name: '列C', type: 'number', width: 120 },
        { id: 'col_4', name: '合計', type: 'formula', width: 150 }
      ]
    };

    createTable(newTable)
      .then(createdTable => {
        setSelectedTableId(createdTable._id);
      })
      .catch(error => {
        console.error('Error creating table:', error);
        alert('テーブルの作成に失敗しました');
      });
  };

  const handleNewFormula = () => {
    const newFormula = {
      name: `数式 ${formulas.length + 1}`,
      description: '新しい数式',
      expression: {
        type: 'add',
        operands: [
          { type: 'constant', value: 1 },
          { type: 'constant', value: 1 }
        ]
      }
    };

    createFormula(newFormula)
      .catch(error => {
        console.error('Error creating formula:', error);
        alert('数式の作成に失敗しました');
      });
  };

  const handleSettings = () => {
    alert('設定機能は今後実装予定です');
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ツールバー */}
      <Toolbar
        selectedTableName={selectedTable?.name}
        onSave={handleSave}
        onNewTable={handleNewTable}
        onSettings={handleSettings}
        onFormulaEditor={() => setShowFormulaEditor(!showFormulaEditor)}
        isFormulaEditorOpen={showFormulaEditor}
      />

      {/* メインエリア */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* サイドバー */}
        <Sidebar
          tables={tables}
          formulas={formulas}
          selectedTableId={selectedTableId}
          onTableSelect={handleTableSelect}
          onNewTable={handleNewTable}
          onNewFormula={handleNewFormula}
        />

        {/* 表ビューエリア */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 表グリッド */}
          <div style={{ flex: 1 }}>
            <TableGrid
              table={table}
              cells={cells}
              onCellEdit={handleCellEdit}
              onCellSelect={handleCellSelect}
              loading={tableLoading}
            />
          </div>

          {/* 数式エディタ */}
          <FormulaEditor
            cellId={selectedCellId || '未選択'}
            initialFormula="=A1*B1"
            onSave={handleFormulaSave}
            isVisible={showFormulaEditor}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
