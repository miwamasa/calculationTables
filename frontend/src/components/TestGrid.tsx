import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export const TestGrid: React.FC = () => {
  // テスト用のハードコードされたデータ
  const columnDefs: ColDef[] = [
    { field: 'product', headerName: '商品名', width: 150, editable: true },
    { field: 'price', headerName: '単価', width: 120, editable: true },
    { field: 'quantity', headerName: '数量', width: 120, editable: true },
    { field: 'total', headerName: '合計', width: 150, editable: true }
  ];

  const rowData = [
    { id: 'row_1', product: '商品1', price: 1100, quantity: 2, total: 2200 },
    { id: 'row_2', product: '商品2', price: 1200, quantity: 4, total: 4800 },
    { id: 'row_3', product: '商品3', price: 1300, quantity: 6, total: 7800 },
    { id: 'row_4', product: '商品4', price: 1400, quantity: 8, total: 11200 },
    { id: 'row_5', product: '商品5', price: 1500, quantity: 10, total: 15000 }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px'
    }}>
      <h3>テストグリッド（ハードコードデータ）</h3>
      <div className="ag-theme-alpine" style={{ height: '400px', width: '600px' }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          defaultColDef={{
            resizable: true,
            sortable: true,
            editable: true
          }}
          animateRows={true}
        />
      </div>
      <p style={{ marginTop: '10px', color: '#666' }}>
        このグリッドが表示される場合、AG-Gridの設定は正常です。
      </p>
    </div>
  );
};