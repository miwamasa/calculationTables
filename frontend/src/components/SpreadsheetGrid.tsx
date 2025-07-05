import React, { useEffect, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { useWebSocket } from '../hooks/useWebSocket';
import { useTableData } from '../hooks/useTableData';

interface SpreadsheetGridProps {
  tableId: string;
  updateCell: (tableId: string, rowId: string, columnId: string, newValue: any) => Promise<any>;
}

export const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({ tableId, updateCell }) => {
  const { socket } = useWebSocket();
  const { table, cells } = useTableData(tableId);
  const [gridApi, setGridApi] = React.useState<GridApi | null>(null);

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };

  const onCellValueChanged = useCallback(async (params: any) => {
    const { colDef, newValue, rowIndex } = params;
    const rowId = `row_${rowIndex + 1}`;
    const columnId = colDef.field;
    
    await updateCell(tableId, rowId, columnId, newValue);
    
    // WebSocket経由で更新を送信
    socket?.emit('cell:update', {
      tableId,
      cellId: `${tableId}_${rowId}_${columnId}`,
      value: newValue
    });
  }, [tableId, updateCell, socket]);

  useEffect(() => {
    if (socket) {
      socket.on('cells:updated', (data) => {
        if (data.tableId === tableId && gridApi) {
          // グリッドを更新
          data.updates.forEach((update: any) => {
            const rowNode = gridApi.getRowNode(update.row_id);
            if (rowNode) {
              rowNode.setDataValue(update.column_id, update.value);
            }
          });
        }
      });
    }
  }, [socket, tableId, gridApi]);

  const columns: ColDef[] = table?.columns.map(col => ({
    field: col.id,
    headerName: col.name,
    width: col.width,
    editable: true,
    cellEditor: col.type === 'formula' ? 'formulaEditor' : 'agTextCellEditor'
  })) || [];

  return (
    <div className="ag-theme-alpine" style={{ height: '100%', width: '100%' }}>
      <AgGridReact
        columnDefs={columns}
        rowData={cells}
        onGridReady={onGridReady}
        onCellValueChanged={onCellValueChanged}
        defaultColDef={{
          resizable: true,
          sortable: true
        }}
      />
    </div>
  );
};