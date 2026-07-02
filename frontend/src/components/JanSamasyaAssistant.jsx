import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FaComments, FaPaperPlane, FaTimes } from 'react-icons/fa';
import '../assets/styls/JanSamasyaAssistant.css';

const WELCOME_MESSAGE =
  'Namaste! Main Jan Samasya Assistant hoon. Aap mujhse platform ke baare mein kuch bhi puch sakte hain — jaise account banana, problem report karna, ya voting kaise kaam karti hai.';

  const QUICK_QUESTIONS = [
    'What is Jan Samasya?',
    'How can I report a problem?',
    'How does voting work?',
    'How do I sign up?',
  ];

function JanSamasyaAssistant() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: WELCOME_MESSAGE },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const history = messages.filter((msg) => msg.role === 'user' || msg.role === 'model');
    const nextMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/chat`, {
        message: trimmed,
        history: history.slice(-10),
      });
      setMessages((prev) => [...prev, { role: 'model', text: res.data.reply }]);
    } catch (err) {
      const errorText =
        err.response?.data?.message ||
        'Abhi jawab nahi de pa raha. Thodi der baad try karein.';
      setMessages((prev) => [...prev, { role: 'model', text: errorText }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="js-assistant-root">
      {isOpen && (
        <div className="js-assistant-panel" role="dialog" aria-label="Jan Samasya Assistant">
          <div className="js-assistant-header">
            <div>
            <h3>Jan Samasya Assistant 👤 Aagam Jain</h3>
              <p>Basic platform help & information</p>
            </div>
            <button
              type="button"
              className="js-assistant-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close assistant"
            >
              <FaTimes />
            </button>
          </div>

          <div className="js-assistant-messages">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`js-assistant-bubble js-assistant-bubble--${msg.role}`}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="js-assistant-bubble js-assistant-bubble--model js-assistant-typing">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="js-assistant-quick">
            {QUICK_QUESTIONS.map((question) => (
              <button
                key={question}
                type="button"
                className="js-assistant-quick-btn"
                onClick={() => sendMessage(question)}
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>

          <form className="js-assistant-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Apna sawaal likhein..."
              disabled={isLoading}
              aria-label="Chat message"
            />
            <button type="submit" disabled={isLoading || !input.trim()} aria-label="Send message">
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="js-assistant-toggle"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close Jan Samasya Assistant' : 'Open Jan Samasya Assistant'}
      >
        {isOpen ? <FaTimes /> : <FaComments />}
        <span>Assistant</span>
      </button>
    </div>
  );
}

export default JanSamasyaAssistant;
