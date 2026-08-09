// components/LectureTabs.jsx (existing file mein tab list update)
// const tabs = ['About', 'Resources', 'Quiz', 'Discussions', 'Ask AI'];

// har tab render mein AskAI ke liye ek sparkle/bot icon add kar sakte ho
// components/AskAI/AskAIPanel.jsx
import { useState, useEffect, useRef } from 'react';
import { Send, Maximize2, Minimize2, Bookmark } from 'lucide-react';
import axios from '../../utils/axiosInstance'; // your existing axios instance

export default function AskAIPanel({ lectureId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchHistory();
  }, [lectureId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const { data } = await axios.get(`/api/ai-chat/${lectureId}`);
      setMessages(data.messages || []);
    } catch (err) {
      console.error('Failed to load chat history', err);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await axios.post(`/api/ai-chat/${lectureId}`, { message: input });
      setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', content: 'Kuch error aaya, dobara try karo.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={`flex flex-col bg-white rounded-xl border border-gray-200 transition-all ${
        fullScreen ? 'fixed inset-0 z-50 rounded-none' : 'h-[600px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Ask AI</h2>
          <p className="text-sm text-gray-500">Doubts poocho isi lecture se related</p>
        </div>
        <button
          onClick={() => setFullScreen(!fullScreen)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
        >
          {fullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-10">
            Is lecture ke baare mein kuch bhi pucho — main help karunga.
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              {msg.content}
              {msg.role === 'model' && (
                <button
                  className="ml-2 inline-flex items-center text-xs text-violet-600 hover:underline"
                  title="Save as note"
                >
                  <Bookmark size={12} className="mr-1" /> Save
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400">AI type kar raha hai...</div>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 flex items-center gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Apna doubt likho..."
          className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white p-3 rounded-xl"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
