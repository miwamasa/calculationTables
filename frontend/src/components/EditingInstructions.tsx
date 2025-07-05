import React, { useState } from 'react';

export const EditingInstructions: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return (
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 100
      }}>
        <button
          onClick={() => setIsVisible(true)}
          style={{
            padding: '8px 12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          ❓ 使い方
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '6px',
      padding: '12px',
      maxWidth: '300px',
      fontSize: '14px',
      zIndex: 100,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px'
      }}>
        <strong style={{ color: '#856404' }}>📝 データ編集方法</strong>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#856404'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ color: '#856404', lineHeight: '1.4' }}>
        <div><strong>セル編集:</strong></div>
        <div>• セルを<strong>ダブルクリック</strong></div>
        <div>• または<strong>F2キー</strong>で編集開始</div>
        <div>• <strong>Enter</strong>で保存</div>
        <div>• <strong>Esc</strong>でキャンセル</div>
        <div>• <strong>Tab</strong>で次のセルへ移動</div>
        
        <div style={{ marginTop: '8px' }}>
          <strong>数値:</strong> 自動で数値に変換されます<br/>
          <strong>通貨:</strong> ¥マークが自動で付きます
        </div>
      </div>
    </div>
  );
};