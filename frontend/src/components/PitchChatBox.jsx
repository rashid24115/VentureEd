import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { sendPitchMessage } from '../services/api';

export default function PitchChatBox({ sessionId, initialHistory = [] }) {
  const [messages, setMessages] = useState(initialHistory);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(initialHistory);
  }, [sessionId, initialHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMsg = { sender: 'user', message: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await sendPitchMessage(sessionId, { message: userText });
      const aiReply = res.data?.data || res.data;
      if (aiReply && aiReply.message) {
        setMessages((prev) => [...prev, aiReply]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai_vc',
            message: 'Interesting point. How does that translate into long-term defensibility against incumbents?',
            rating: 7,
            criticismTag: 'Execution Question',
          },
        ]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai_vc',
          message: 'Can you unpack your customer acquisition cost assumptions on that?',
          rating: 6,
          criticismTag: 'Follow-up',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm h-[580px] flex flex-col overflow-hidden">
      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          const criticism = msg.criticismTag || msg.criticism_tag;

          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs ${
                  isUser
                    ? 'bg-gradient-to-tr from-indigo-600 to-violet-600'
                    : 'bg-gradient-to-tr from-emerald-600 to-teal-600'
                }`}
              >
                {isUser ? <User size={15} /> : <Bot size={15} />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[80%] sm:max-w-[70%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-xs'
                    : 'bg-slate-100/90 text-slate-900 rounded-tl-none border border-slate-200/60'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.message}</p>

                {/* Optional VC Evaluation Rating & Tag */}
                {!isUser && msg.rating && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        msg.rating >= 7
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      Investor Score: {msg.rating}/10
                    </span>
                    {criticism && (
                      <span className="text-[10px] font-medium bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded-full">
                        {criticism}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-11">
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
            <span>Investor is formulating critique...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pitch your answer to the investor (e.g., Our CAC payback is 4 months through viral referral loops)..."
          className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
        >
          <Send size={14} />
          <span className="hidden sm:inline">Send Pitch</span>
        </button>
      </form>
    </div>
  );
}