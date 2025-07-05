import { useState, useCallback } from 'react';
import { ConsoleMessage } from '../components/Console';

export const useConsole = () => {
  const [messages, setMessages] = useState<ConsoleMessage[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const addMessage = useCallback((type: ConsoleMessage['type'], message: string) => {
    const newMessage: ConsoleMessage = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      type,
      message
    };

    setMessages(prev => [...prev, newMessage]);
    
    // 自動的にコンソールを表示
    if (!isVisible) {
      setIsVisible(true);
    }

    // メッセージが100個を超えたら古いものを削除
    setMessages(prev => {
      if (prev.length > 100) {
        return prev.slice(-100);
      }
      return prev;
    });
  }, [isVisible]);

  const addInfo = useCallback((message: string) => {
    addMessage('info', message);
  }, [addMessage]);

  const addSuccess = useCallback((message: string) => {
    addMessage('success', message);
  }, [addMessage]);

  const addWarning = useCallback((message: string) => {
    addMessage('warning', message);
  }, [addMessage]);

  const addError = useCallback((message: string) => {
    addMessage('error', message);
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const toggleConsole = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const showConsole = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideConsole = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    messages,
    isVisible,
    addMessage,
    addInfo,
    addSuccess,
    addWarning,
    addError,
    clearMessages,
    toggleConsole,
    showConsole,
    hideConsole
  };
};