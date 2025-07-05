import React, { useState, useEffect, useRef } from 'react';

export interface ConsoleMessage {
  id: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface ConsoleProps {
  messages: ConsoleMessage[];
  isVisible: boolean;
  onToggle: () => void;
  onClear: () => void;
}

export const Console: React.FC<ConsoleProps> = ({
  messages,
  isVisible,
  onToggle,
  onClear
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isVisible) {
      scrollToBottom();
    }
  }, [messages, isVisible]);

  const getMessageStyle = (type: ConsoleMessage['type']) => {
    const baseStyle = {
      padding: '4px 8px',
      margin: '2px 0',
      borderRadius: '3px',
      fontSize: '12px',
      fontFamily: 'monospace',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    };

    switch (type) {
      case 'success':
        return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' };
      case 'warning':
        return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeaa7' };
      case 'error':
        return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' };
      default:
        return { ...baseStyle, backgroundColor: '#f8f9fa', color: '#495057', border: '1px solid #dee2e6' };
    }
  };

  const getIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('ja-JP', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (!isVisible) return null;

  return (
    <div style={{
      height: '100%',
      backgroundColor: '#1e1e1e',
      color: '#ffffff',
      border: '1px solid #444',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      {/* ヘッダー */}
      <div style={{
        padding: '8px 12px',
        backgroundColor: '#2d2d2d',
        borderBottom: '1px solid #444',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>🖥️ コンソール</span>
          <span style={{ color: '#888', fontSize: '11px' }}>
            ({messages.length} メッセージ)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onClear}
            style={{
              background: 'none',
              border: '1px solid #555',
              color: '#ccc',
              padding: '2px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            クリア
          </button>
          <button
            onClick={onToggle}
            style={{
              background: 'none',
              border: '1px solid #555',
              color: '#ccc',
              padding: '2px 8px',
              borderRadius: '3px',
              cursor: 'pointer',
              fontSize: '11px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* メッセージ表示エリア */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '8px'
      }}>
        {messages.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>
            コンソールメッセージがありません
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} style={getMessageStyle(msg.type)}>
              <span style={{ color: '#888', minWidth: '60px' }}>
                {formatTime(msg.timestamp)}
              </span>
              <span>{getIcon(msg.type)}</span>
              <span style={{ flex: 1 }}>{msg.message}</span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};