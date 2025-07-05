import React, { useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent, CellEditingStoppedEvent } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

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
}

interface TableGridProps {
  table: Table | null;
  cells: Cell[];
  onCellEdit: (cellId: string, newValue: any) => void;
  onCellSelect: (cellId: string) => void;
  loading: boolean;
}

export const TableGrid: React.FC<TableGridProps> = ({
  table,
  cells,
  onCellEdit,
  onCellSelect,
  loading
}) => {
  const [gridApi, setGridApi] = React.useState<GridApi | null>(null);
  const [rowData, setRowData] = React.useState<any[]>([]);

  // セルデータをグリッド用の行データに変換
  useEffect(() => {
    if (!table || !cells.length) {
      setRowData([]);
      return;
    }

    // 行IDでグループ化
    const rowsMap = new Map<string, any>();
    
    cells.forEach(cell => {
      if (!rowsMap.has(cell.row_id)) {
        rowsMap.set(cell.row_id, { id: cell.row_id });
      }
      rowsMap.get(cell.row_id)![cell.column_id] = cell.value;
    });

    setRowData(Array.from(rowsMap.values()));
  }, [table, cells]);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const onCellEditingStopped = useCallback((event: CellEditingStoppedEvent) => {
    if (event.oldValue !== event.newValue) {
      const cellId = `${table?._id}_${event.data.id}_${event.colDef.field}`;
      onCellEdit(cellId, event.newValue);
    }
  }, [table, onCellEdit]);

  const onCellClicked = useCallback((event: any) => {
    const cellId = `${table?._id}_${event.data.id}_${event.colDef.field}`;
    onCellSelect(cellId);
  }, [table, onCellSelect]);

  // カラム定義を生成
  const columnDefs: ColDef[] = React.useMemo(() => {
    if (!table) return [];

    return table.columns.map(col => ({
      field: col.id,
      headerName: col.name,
      width: col.width || 150,
      editable: true,
      cellDataType: col.type === 'number' ? 'number' : 'text',
      valueFormatter: col.format === 'currency' ? 
        (params) => params.value ? `¥${params.value.toLocaleString()}` : '' : 
        undefined,
      cellStyle: col.type === 'formula' ? 
        { backgroundColor: '#f8f9fa', fontStyle: 'italic' } : 
        undefined
    }));
  }, [table]);

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
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        onGridReady={onGridReady}
        onCellEditingStopped={onCellEditingStopped}
        onCellClicked={onCellClicked}
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true
        }}
        suppressRowClickSelection={true}
        rowSelection="single"
        animateRows={true}
        enableCellTextSelection={true}
        ensureDomOrder={true}
      />
    </div>
  );
};