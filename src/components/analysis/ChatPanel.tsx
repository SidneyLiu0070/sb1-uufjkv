import React, { useState, useCallback } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: number;
  }>>([]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: message,
      role: 'user' as const,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    try {
      // TODO: Implement actual API call for SVG adjustments
      // For now, just show a response message
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          content: '已收到您的修改建议，正在处理中...',
          role: 'assistant',
          timestamp: Date.now()
        }]);
      }, 1000);
    } catch (error) {
      toast.error('处理修改建议时出错');
    }
  }, [message]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">SVG 修改建议</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-lg px-4 py-2
                ${msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'}
              `}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="输入修改建议..."
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className={`
              px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
              ${message.trim() 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'}
            `}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatPanel;