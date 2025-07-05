import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
  ColumnDef,
  Row
} from '@tanstack/react-table';
import { TableToolbar } from './TableToolbar';

interface Table {
  _id: string;
  name: string;
  columns: Array<{
    id: string;
    name: string;
    type: string;
    width?: number;
    format?: string;
  }>;
}

interface Cell {
  _id: string;
  table_id: string;
  row_id: string;
  column_id: string;
  value: any;
  type: string;
  formula_id?: string;
}

interface TableData {
  id: string;
  [key: string]: any;
}

interface SimpleTableGridProps {
  table: Table | null;
  cells: Cell[];
  formulas: any[];
  onCellEdit: (tableId: string, rowId: string, columnId: string, newValue: any) => void;
  onCellSelect: (cellId: string) => void;
  onAddRow: () => void;
  onDeleteRow: (rowId: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const SimpleTableGrid: React.FC<SimpleTableGridProps> = ({
  table,
  cells,
  formulas,
  onCellEdit,
  onCellSelect,
  onAddRow,
  onDeleteRow,
  onRefresh,
  loading
}) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editingCell, setEditingCell] = useState<{ rowId: string; columnId: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  console.log('SimpleTableGrid render - cells:', cells.length, 'cells data:', cells);

  // セルデータを行データに変換
  const rowData = useMemo(() => {
    if (!table || !cells) return [];

    console.log('=== SimpleTableGrid Data Processing ===');
    console.log('Table:', table);
    console.log('Cells:', cells);

    // 行IDでグループ化
    const rowsMap = new Map<string, TableData>();
    
    cells.forEach(cell => {
      console.log('Processing cell:', cell);
      if (!rowsMap.has(cell.row_id)) {
        rowsMap.set(cell.row_id, { id: cell.row_id });
      }
      rowsMap.get(cell.row_id)![cell.column_id] = cell.value;
    });

    // 既存の行データを取得
    const existingRows = Array.from(rowsMap.values());
    
    // 空の行がない場合は、少なくとも5行の空行を作成（ただし、既存データを上書きしない）
    const totalRows = Math.max(existingRows.length, 5);
    
    for (let i = 1; i <= totalRows; i++) {
      const rowId = `row_${i}`;
      if (!rowsMap.has(rowId)) {
        const emptyRow: TableData = { id: rowId };
        table.columns.forEach(col => {
          emptyRow[col.id] = '';
        });
        rowsMap.set(rowId, emptyRow);
      }
    }

    const finalRowData = Array.from(rowsMap.values()).sort((a, b) => {
      const aNum = parseInt(a.id.replace('row_', ''));
      const bNum = parseInt(b.id.replace('row_', ''));
      return aNum - bNum;
    });
    
    console.log('Final row data:', finalRowData);
    return finalRowData;
  }, [table, cells]);

  // カラム定義を作成
  const columns = useMemo<ColumnDef<TableData>[]>(() => {
    if (!table) return [];

    const columnHelper = createColumnHelper<TableData>();
    
    const selectColumn = columnHelper.display({
      id: 'select',
      header: () => (
        <input
          type="checkbox"
          checked={selectedRows.length === rowData.length && rowData.length > 0}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(rowData.map(row => row.id));
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(row.original.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(prev => [...prev, row.original.id]);
            } else {
              setSelectedRows(prev => prev.filter(id => id !== row.original.id));
            }
          }}
        />
      ),
      size: 50
    });

    const dataColumns = table.columns.map(col => 
      columnHelper.accessor(col.id as any, {
        header: col.name,
        cell: ({ row, getValue, column }) => {
          const cellId = `${table._id}_${row.original.id}_${column.id}`;
          const value = getValue() as any;
          const isEditing = editingCell?.rowId === row.original.id && editingCell?.columnId === column.id;

          if (isEditing) {
            return (
              <input
                type={col.type === 'number' ? 'number' : 'text'}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => {
                  const newValue = col.type === 'number' ? parseFloat(editValue) || 0 : editValue;
                  onCellEdit(table._id, row.original.id, column.id, newValue);
                  setEditingCell(null);
                  setEditValue('');
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const newValue = col.type === 'number' ? parseFloat(editValue) || 0 : editValue;
                    onCellEdit(table._id, row.original.id, column.id, newValue);
                    setEditingCell(null);
                    setEditValue('');
                  } else if (e.key === 'Escape') {
                    setEditingCell(null);
                    setEditValue('');
                  }
                }}
                autoFocus
                style={{
                  width: '100%',
                  border: '2px solid #007bff',
                  padding: '4px'
                }}
              />
            );
          }

          // セルに適用された数式を取得
          const cellData = cells.find(cell => 
            cell.row_id === row.original.id && cell.column_id === column.id
          );
          const hasFormula = cellData?.formula_id;
          const formulaInfo = hasFormula ? formulas.find(f => f._id === cellData.formula_id) : null;

          return (
            <div
              onClick={() => {
                setEditingCell({ rowId: row.original.id, columnId: column.id });
                setEditValue(String(value || ''));
                onCellSelect(cellId);
              }}
              style={{
                padding: '4px 8px',
                cursor: 'pointer',
                backgroundColor: hasFormula ? '#e8f5e8' : (col.type === 'formula' ? '#f8f9fa' : 'transparent'),
                fontStyle: col.type === 'formula' ? 'italic' : 'normal',
                minHeight: '24px',
                border: hasFormula ? '1px solid #28a745' : '1px solid transparent',
                position: 'relative'
              }}
              title={hasFormula ? `数式が適用されています: ${formulaInfo?.name || 'Unknown'}` : undefined}
            >
              {col.format === 'currency' && value ? 
                `¥${Number(value).toLocaleString()}` : 
                String(value || '')
              }
              {hasFormula && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    fontSize: '10px',
                    color: '#28a745',
                    fontWeight: 'bold'
                  }}
                >
                  f
                </span>
              )}
            </div>
          );
        },
        size: col.width || 150
      })
    );

    return [selectColumn, ...dataColumns];
  }, [table, selectedRows, rowData, editingCell, editValue, onCellEdit, onCellSelect]);

  const tableInstance = useReactTable({
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleAddRow = () => {
    console.log('SimpleTableGrid: Add row clicked');
    onAddRow();
  };

  const handleDeleteRow = () => {
    console.log('SimpleTableGrid: Delete rows clicked', selectedRows);
    selectedRows.forEach(rowId => {
      onDeleteRow(rowId);
    });
    setSelectedRows([]);
  };

  const handleRefresh = () => {
    console.log('SimpleTableGrid: Refresh clicked');
    onRefresh();
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        fontSize: '18px',
        color: '#6c757d'
      }}>
        読み込み中...
      </div>
    );
  }

  if (!table) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        color: '#6c757d'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
        <div style={{ fontSize: '18px', marginBottom: '10px' }}>表を選択してください</div>
        <div style={{ fontSize: '14px' }}>サイドバーから既存の表を選択するか、新しい表を作成してください</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <TableToolbar
        tableName={table.name}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        onRefresh={handleRefresh}
        selectedRowCount={selectedRows.length}
      />
      <div style={{ 
        flex: 1, 
        overflow: 'auto',
        border: '1px solid #e9ecef',
        backgroundColor: 'white'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead style={{ 
            backgroundColor: '#f8f9fa',
            position: 'sticky',
            top: 0,
            zIndex: 10
          }}>
            {tableInstance.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    style={{
                      padding: '12px 8px',
                      textAlign: 'left',
                      borderBottom: '2px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      fontWeight: '600',
                      color: '#495057',
                      width: header.getSize()
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {tableInstance.getRowModel().rows.map((row, index) => (
              <tr 
                key={row.id}
                style={{
                  backgroundColor: index % 2 === 0 ? 'white' : '#f8f9fa'
                }}
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    style={{
                      padding: '0',
                      borderBottom: '1px solid #dee2e6',
                      borderRight: '1px solid #dee2e6',
                      verticalAlign: 'top'
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {(!cells || cells.length === 0) && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: '#6c757d'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>データがありません</div>
          <div style={{ fontSize: '14px' }}>「行追加」ボタンで新しい行を追加してください</div>
        </div>
      )}
    </div>
  );
};