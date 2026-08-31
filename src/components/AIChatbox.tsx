import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Language, UserIntakeProfile } from '../types';
import { t } from '../utils/i18n';

interface AIChatboxProps {
  intake: UserIntakeProfile;
  language?: Language;
}

export const AIChatbox: React.FC<AIChatboxProps> = ({ intake, language = 'vi' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    {
      role: 'ai',
      content: language === 'vi'
        ? 'Chào bạn! Tôi là La Bàn AI Agent. Bạn cần tư vấn gì về định hướng nghề nghiệp, kỹ năng hay thị trường lao động trong kỷ nguyên AI?'
        : 'Hello! I am La Bàn AI Agent. How can I assist you with career orientation, skills, or labor market insights in the AI era?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, context: intake })
      });
      const data = await response.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: language === 'vi'
            ? 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.'
            : 'Sorry, I am experiencing a connection issue. Please try again later.'
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: language === 'vi'
          ? 'Lỗi kết nối mạng. Vui lòng kiểm tra lại.'
          : 'Network connection error. Please check your connection.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 p-4 bg-indigo-600 text-white rounded-full shadow-2xl hover:bg-indigo-700 transition-all z-50 flex items-center justify-center hover:scale-105 group cursor-pointer"
        title={t(language, 'Chat với chuyên gia AI', 'Chat with AI Expert')}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute -top-10 right-0 bg-white text-indigo-700 px-3 py-1 text-xs font-bold rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {t(language, 'Hỏi chuyên gia AI!', 'Ask AI Expert!')}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] sm:h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col border border-indigo-100 overflow-hidden transform transition-all">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-4 text-white flex items-center gap-3 shadow-md">
            <div className="bg-white/20 p-2 rounded-full">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">La Bàn AI Agent</h3>
              <p className="text-[10px] text-indigo-100">{t(language, 'Trả lời chuẩn khoa học - Không ảo giác', 'Evidence-grounded - Zero Hallucination')}</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="ml-auto p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
              title={t(language, 'Đóng chat', 'Close Chat')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-indigo-200">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-amber-500 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'} prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-700" />
                </div>
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-1 pr-2 border border-slate-200 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t(language, 'Hỏi về nghề nghiệp, AI...', 'Ask about careers, AI...')}
                className="flex-1 bg-transparent border-none focus:outline-none px-3 py-2 text-sm text-slate-700"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
