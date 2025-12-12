// components/Chatbot.tsx

import React, { useState } from 'react';
import { ai } from '../lib/api';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await ai.chat(input, 'fr', messages);
      const botMessage = { role: 'assistant', content: response.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--primary-color)',
          color: 'white',
          fontSize: '1.5rem',
          border: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          zIndex: 1000
        }}
      >
        💬
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '350px',
      height: '500px',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{
        background: 'var(--primary-color)',
        color: 'white',
        padding: '1rem',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <h3 style={{ margin: 0 }}>AI Assistant</h3>
        <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '1.2rem' }}>
          ×
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {messages.length === 0 && (
          <p style={{ color: 'var(--muted-text-color)', textAlign: 'center' }}>
            Bonjour! Comment puis-je vous aider aujourd'hui?
          </p>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            marginBottom: '1rem',
            padding: '0.75rem',
            borderRadius: '8px',
            background: msg.role === 'user' ? 'var(--primary-color)' : 'var(--secondary-color)',
            color: msg.role === 'user' ? 'white' : 'var(--text-color)',
            marginLeft: msg.role === 'user' ? '2rem' : '0',
            marginRight: msg.role === 'assistant' ? '2rem' : '0'
          }}>
            {msg.content}
          </div>
        ))}
        {loading && <p style={{ color: 'var(--muted-text-color)' }}>Typing...</p>}
      </div>
      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: 1 }}
          />
          <button onClick={sendMessage} disabled={loading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}