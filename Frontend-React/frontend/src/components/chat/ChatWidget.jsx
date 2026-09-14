import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { aiApi } from '../../api/aiApi';

/**
 * Floating AI Learning Assistant widget. Available on every page once a
 * user is logged in. Keeps its own local chat history (not persisted -
 * a fresh session per page load keeps things simple for this project).
 */
export default function ChatWidget() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI Learning Assistant. Ask me anything about your courses, or for study tips." }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  if (!user) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setIsSending(true);

    try {
      const { data } = await aiApi.chat(trimmed, null);
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "Sorry, I'm having trouble responding right now. Please try again shortly." }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="chat-widget-window">
          <div className="chat-widget-header d-flex justify-content-between align-items-center">
            <span><i className="bi bi-stars me-2" />AI Learning Assistant</span>
            <button
              className="btn btn-sm btn-link text-white p-0"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>
          <div className="chat-widget-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role === 'user' ? 'user' : 'assistant'}`}>
                {m.text}
              </div>
            ))}
            {isSending && <div className="chat-bubble assistant text-muted">Thinking…</div>}
            <div ref={messagesEndRef} />
          </div>
          <form className="d-flex border-top p-2 gap-2" onSubmit={handleSend}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Ask a question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isSending}
            />
            <button className="btn btn-primary btn-sm" type="submit" disabled={isSending}>
              <i className="bi bi-send-fill" />
            </button>
          </form>
        </div>
      )}
      <button
        className="chat-widget-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle AI Learning Assistant"
      >
        <i className={`bi ${isOpen ? 'bi-x-lg' : 'bi-chat-dots-fill'}`} />
      </button>
    </>
  );
}
