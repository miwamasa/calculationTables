import React from 'react';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { SimpleTableGrid } from './components/SimpleTableGrid';
import { FormulaEditor } from './components/FormulaEditor';
import { FormulaApplicator } from './components/FormulaApplicator';
import { FormulaEditorModal } from './components/FormulaEditorModal';
import { TableEditor } from './components/TableEditor';
import { CalculationHistory } from './components/CalculationHistory';
import { Console } from './components/Console';
import { useTableManagement } from './hooks/useTableManagement';
import { useTableData } from './hooks/useTableData';
import { useConsole } from './hooks/useConsole';
import './App.css';

function App() {
  const [selectedTableId, setSelectedTableId] = React.useState<string | null>(null);
  const [selectedFormulaId, setSelectedFormulaId] = React.useState<string | null>(null);
  const [selectedCellId, setSelectedCellId] = React.useState<string>('');
  const [showFormulaEditor, setShowFormulaEditor] = React.useState(false);
  const [showFormulaApplicator, setShowFormulaApplicator] = React.useState(false);
  const [showTableEditor, setShowTableEditor] = React.useState(false);
  const [showFormulaEditorModal, setShowFormulaEditorModal] = React.useState(false);
  const [showCalculationHistory, setShowCalculationHistory] = React.useState(false);
  const [editingTableId, setEditingTableId] = React.useState<string | null>(null);
  const [editingFormulaId, setEditingFormulaId] = React.useState<string | null>(null);

  const { 
    tables, 
    formulas, 
    loading: managementLoading, 
    createTable, 
    createFormula,
    updateTable,
    deleteTable,
    deleteFormula,
    updateFormula,
    createSampleData
  } = useTableManagement();
  const { table, cells, loading: tableLoading, updateCell, addRow, deleteRow, refreshData, applyFormulaToCell } = useTableData(selectedTableId);
  const { 
    messages, 
    isVisible: isConsoleVisible, 
    addSuccess, 
    addError, 
    addInfo, 
    clearMessages, 
    toggleConsole 
  } = useConsole();

  const selectedTable = tables.find(t => t._id === selectedTableId);

  const handleTableSelect = async (tableId: string) => {
    console.log('Table selected:', tableId);
    setSelectedTableId(tableId);
    setSelectedCellId('');
    
    addInfo(`テーブルが選択されました: ${tables.find(t => t._id === tableId)?.name || tableId}`);
    
    // サンプルデータを作成（データがない場合）
    try {
      console.log('Creating sample data for table:', tableId);
      await createSampleData(tableId);
      addSuccess('サンプルデータを作成しました');
    } catch (error) {
      console.error('Error creating sample data:', error);
      addError('サンプルデータの作成に失敗しました');
    }
  };

  const handleCellEdit = async (tableId: string, rowId: string, columnId: string, newValue: any) => {
    try {
      await updateCell(tableId, rowId, columnId, newValue);
    } catch (error) {
      console.error('Error updating cell:', error);
    }
  };

  const handleAddRow = async () => {
    console.log('handleAddRow called, selectedTableId:', selectedTableId);
    if (!selectedTableId) {
      addError('テーブルが選択されていません');
      return;
    }
    try {
      console.log('Calling addRow API...');
      const result = await addRow(selectedTableId);
      console.log('Row added successfully:', result);
      addSuccess('新しい行を追加しました');
    } catch (error) {
      console.error('Error adding row:', error);
      addError('行の追加に失敗しました');
    }
  };

  const handleDeleteRow = async (rowId: string) => {
    if (!selectedTableId) return;
    try {
      await deleteRow(selectedTableId, rowId);
      addSuccess(`行 ${rowId} を削除しました`);
    } catch (error) {
      console.error('Error deleting row:', error);
      addError('行の削除に失敗しました');
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshData();
      addSuccess('データを更新しました');
    } catch (error) {
      console.error('Error refreshing data:', error);
      addError('データの更新に失敗しました');
    }
  };

  const handleCellSelect = (cellId: string) => {
    setSelectedCellId(cellId);
  };

  const handleFormulaApply = (formula: any) => {
    console.log('Formula applied to cell:', formula);
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

  const handleFormulaSelect = (formulaId: string) => {
    console.log('Formula selected:', formulaId);
    setSelectedFormulaId(formulaId);
  };

  const handleNewFormula = () => {
    setEditingFormulaId(null);
    setShowFormulaEditorModal(true);
  };

  const handleEditFormula = (formulaId: string) => {
    setEditingFormulaId(formulaId);
    setShowFormulaEditorModal(true);
  };

  const handleDeleteFormula = async (formulaId: string) => {
    try {
      await deleteFormula(formulaId);
      if (selectedFormulaId === formulaId) {
        setSelectedFormulaId(null);
      }
    } catch (error) {
      console.error('Error deleting formula:', error);
      alert('数式の削除に失敗しました');
    }
  };

  const handleFormulaSave = async (formulaData: any) => {
    try {
      if (editingFormulaId) {
        await updateFormula(editingFormulaId, formulaData);
      } else {
        await createFormula(formulaData);
      }
      setShowFormulaEditorModal(false);
      setEditingFormulaId(null);
    } catch (error) {
      console.error('Error saving formula:', error);
      alert('数式の保存に失敗しました');
    }
  };

  const handleFormulaCancel = () => {
    setShowFormulaEditorModal(false);
    setEditingFormulaId(null);
  };

  const handleApplyFormula = async (formulaId: string, cellId: string) => {
    if (!selectedTableId) return;
    
    try {
      console.log('handleApplyFormula called with:', { formulaId, cellId, selectedTableId });
      
      // cellIdから tableId, rowId, columnId を抽出
      // 形式: tableId_row_N_columnId
      const parts = cellId.split('_');
      console.log('CellId parts:', parts);
      
      if (parts.length < 4) {
        console.error('Invalid cellId format:', cellId);
        alert('無効なセルIDです');
        return;
      }
      
      // 形式: tableId_row_N_columnId
      const tableIdFromCell = parts[0];
      const rowId = `${parts[1]}_${parts[2]}`; // 'row_N' の形式
      const columnId = parts.slice(3).join('_'); // columnIdに_が含まれている場合に対応
      
      console.log('Extracted values:', { tableIdFromCell, rowId, columnId });
      console.log('Using tableId:', selectedTableId);
      
      const result = await applyFormulaToCell(selectedTableId, rowId, columnId, formulaId);
      console.log('Formula applied successfully, result:', result);
      
      // データを再取得して確実に更新
      await refreshData();
      
      // 成功メッセージに計算結果を表示
      const formula = formulas.find(f => f._id === formulaId);
      const formulaName = formula ? formula.name : '数式';
      addSuccess(`${formulaName}を適用しました (${rowId}:${columnId}) → 結果: ${result.value}`);
    } catch (error) {
      console.error('Error applying formula:', error);
      addError('数式の適用に失敗しました');
    }
  };

  const handleSettings = () => {
    addInfo('設定機能は今後実装予定です');
  };

  const handleEditTable = (tableId: string) => {
    setEditingTableId(tableId);
    setShowTableEditor(true);
  };

  const handleDeleteTable = async (tableId: string) => {
    try {
      await deleteTable(tableId);
      if (selectedTableId === tableId) {
        setSelectedTableId(null);
      }
    } catch (error) {
      console.error('Error deleting table:', error);
      alert('テーブルの削除に失敗しました');
    }
  };

  const handleTableSave = async (updatedTable: any) => {
    if (!editingTableId) return;
    
    try {
      await updateTable(editingTableId, updatedTable);
      setShowTableEditor(false);
      setEditingTableId(null);
    } catch (error) {
      console.error('Error updating table:', error);
      alert('テーブルの更新に失敗しました');
    }
  };

  const editingTable = editingTableId ? tables.find(t => t._id === editingTableId) : null;
  const editingFormula = editingFormulaId ? formulas.find(f => f._id === editingFormulaId) : null;

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
        onFormulaApplicator={() => setShowFormulaApplicator(!showFormulaApplicator)}
        isFormulaApplicatorOpen={showFormulaApplicator}
        onCalculationHistory={() => setShowCalculationHistory(true)}
        onToggleConsole={toggleConsole}
        isConsoleVisible={isConsoleVisible}
      />

      {/* メインエリア */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* サイドバー */}
        <Sidebar
          tables={tables}
          formulas={formulas}
          selectedTableId={selectedTableId}
          selectedFormulaId={selectedFormulaId}
          onTableSelect={handleTableSelect}
          onFormulaSelect={handleFormulaSelect}
          onNewTable={handleNewTable}
          onNewFormula={handleNewFormula}
          onDeleteTable={handleDeleteTable}
          onEditTable={handleEditTable}
          onDeleteFormula={handleDeleteFormula}
          onEditFormula={handleEditFormula}
        />

        {/* 表ビューエリア */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* 表グリッド */}
          <div style={{ 
            flex: isConsoleVisible ? '1 1 60%' : '1 1 auto', 
            minHeight: '300px',
            overflow: 'hidden'
          }}>
            <SimpleTableGrid
              table={table}
              cells={cells}
              formulas={formulas}
              onCellEdit={handleCellEdit}
              onCellSelect={handleCellSelect}
              onAddRow={handleAddRow}
              onDeleteRow={handleDeleteRow}
              onRefresh={handleRefresh}
              loading={tableLoading}
            />
          </div>

          {/* 数式エディタ */}
          <FormulaEditor
            cellId={selectedCellId || '未選択'}
            initialFormula="=A1*B1"
            onSave={handleFormulaApply}
            isVisible={showFormulaEditor}
          />

          {/* 数式適用器 */}
          <FormulaApplicator
            formulas={formulas}
            selectedCellId={selectedCellId || '未選択'}
            onApplyFormula={handleApplyFormula}
            isVisible={showFormulaApplicator}
          />

          {/* コンソール */}
          {isConsoleVisible && (
            <div style={{ 
              flex: '0 0 220px',
              padding: '10px',
              borderTop: '1px solid #dee2e6'
            }}>
              <Console
                messages={messages}
                isVisible={isConsoleVisible}
                onToggle={toggleConsole}
                onClear={clearMessages}
              />
            </div>
          )}
        </div>
      </div>

      {/* テーブルエディタモーダル */}
      {showTableEditor && editingTable && (
        <TableEditor
          table={editingTable}
          onSave={handleTableSave}
          onAddColumn={() => {}}
          onDeleteColumn={() => {}}
          onClose={() => {
            setShowTableEditor(false);
            setEditingTableId(null);
          }}
        />
      )}

      {/* 数式エディタモーダル */}
      <FormulaEditorModal
        formula={editingFormula || null}
        isOpen={showFormulaEditorModal}
        onSave={handleFormulaSave}
        onCancel={handleFormulaCancel}
      />

      {/* 計算履歴モーダル */}
      <CalculationHistory
        tableId={selectedTableId}
        isVisible={showCalculationHistory}
        onClose={() => setShowCalculationHistory(false)}
      />
    </div>
  );
}

export default App;
