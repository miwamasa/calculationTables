import React from 'react';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { SimpleTableGrid } from './components/SimpleTableGrid';
import { FormulaEditor } from './components/FormulaEditor';
import { FormulaApplicator } from './components/FormulaApplicator';
import { FormulaEditorModal } from './components/FormulaEditorModal';
import { TableEditor } from './components/TableEditor';
import { useTableManagement } from './hooks/useTableManagement';
import { useTableData } from './hooks/useTableData';
import './App.css';

function App() {
  const [selectedTableId, setSelectedTableId] = React.useState<string | null>(null);
  const [selectedFormulaId, setSelectedFormulaId] = React.useState<string | null>(null);
  const [selectedCellId, setSelectedCellId] = React.useState<string>('');
  const [showFormulaEditor, setShowFormulaEditor] = React.useState(false);
  const [showFormulaApplicator, setShowFormulaApplicator] = React.useState(false);
  const [showTableEditor, setShowTableEditor] = React.useState(false);
  const [showFormulaEditorModal, setShowFormulaEditorModal] = React.useState(false);
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

  const selectedTable = tables.find(t => t._id === selectedTableId);

  const handleTableSelect = async (tableId: string) => {
    console.log('Table selected:', tableId);
    setSelectedTableId(tableId);
    setSelectedCellId('');
    
    // サンプルデータを作成（データがない場合）
    try {
      console.log('Creating sample data for table:', tableId);
      await createSampleData(tableId);
      console.log('Sample data created successfully');
    } catch (error) {
      console.error('Error creating sample data:', error);
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
      console.log('No table selected, cannot add row');
      return;
    }
    try {
      console.log('Calling addRow API...');
      const result = await addRow(selectedTableId);
      console.log('Row added successfully:', result);
    } catch (error) {
      console.error('Error adding row:', error);
      alert('行の追加に失敗しました');
    }
  };

  const handleDeleteRow = async (rowId: string) => {
    if (!selectedTableId) return;
    try {
      await deleteRow(selectedTableId, rowId);
    } catch (error) {
      console.error('Error deleting row:', error);
      alert('行の削除に失敗しました');
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshData();
    } catch (error) {
      console.error('Error refreshing data:', error);
      alert('データの更新に失敗しました');
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
      // cellIdから tableId, rowId, columnId を抽出
      const parts = cellId.split('_');
      if (parts.length < 3) {
        alert('無効なセルIDです');
        return;
      }
      
      const rowId = parts[1];
      const columnId = parts[2];
      
      console.log('Applying formula:', { formulaId, tableId: selectedTableId, rowId, columnId });
      
      await applyFormulaToCell(selectedTableId, rowId, columnId, formulaId);
      console.log('Formula applied successfully');
      
      // 成功メッセージ
      alert('数式が適用されました！');
    } catch (error) {
      console.error('Error applying formula:', error);
      alert('数式の適用に失敗しました');
    }
  };

  const handleSettings = () => {
    alert('設定機能は今後実装予定です');
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 表グリッド */}
          <div style={{ flex: 1 }}>
            <SimpleTableGrid
              table={table}
              cells={cells}
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
    </div>
  );
}

export default App;
