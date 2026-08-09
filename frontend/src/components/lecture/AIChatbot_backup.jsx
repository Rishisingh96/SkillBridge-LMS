import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaPaperPlane, FaCopy, FaSave, FaExpand, FaCompress, FaTrash, FaHistory, FaStar, FaRegStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

// Custom Markdown Renderer with ChatGPT-style styling
const MarkdownRenderer = ({ content, isDark }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Headings
        h1: ({ children }) => (
          <h1 className={`text-2xl font-bold mt-4 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className={`text-xl font-bold mt-3 mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className={`text-lg font-semibold mt-2 mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {children}
          </h3>
        ),
        // Paragraphs
        p: ({ children }) => (
          <p className={`mb-3 leading-relaxed ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {children}
          </p>
        ),
        // Bold text
        strong: ({ children }) => (
          <strong className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {children}
          </strong>
        ),
        // Italic text
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        // Links
        a: ({ href, children }) => (
          <a 
            href={href} 
            className="text-blue-500 hover:text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {children}
          </a>
        ),
        // Lists
        ul: ({ children }) => (
          <ul className={`list-disc list-inside mb-3 ml-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className={`list-decimal list-inside mb-3 ml-4 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="mb-1">{children}</li>
        ),
        // Code blocks
        code: ({ inline, className, children }) => {
          if (inline) {
            return (
              <code className={`px-1.5 py-0.5 rounded text-sm font-mono ${
                isDark 
                  ? 'bg-gray-800 text-pink-400' 
                  : 'bg-gray-200 text-pink-600'
              }`}>
                {children}
              </code>
            );
          }
          return (
            <code className={`block p-3 rounded-lg text-sm font-mono overflow-x-auto ${
              isDark 
                ? 'bg-gray-800 text-green-400' 
                : 'bg-gray-100 text-green-700'
            }`}>
              {children}
            </code>
          );
        },
        // Blockquotes
        blockquote: ({ children }) => (
          <blockquote className={`border-l-4 pl-4 italic my-3 ${
            isDark 
              ? 'border-blue-500 text-gray-300' 
              : 'border-blue-500 text-gray-600'
          }`}>
            {children}
          </blockquote>
        ),
        // Horizontal rules
        hr: () => (
          <hr className={`my-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`} />
        ),
        // Tables
        table: ({ children }) => (
          <div className="overflow-x-auto mb-4">
            <table className={`min-w-full border-collapse ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className={`font-semibold ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {children}
          </thead>
        ),
        tbody: ({ children }) => (
          <tbody>{children}</tbody>
        ),
        tr: ({ children }) => (
          <tr className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            {children}
          </tr>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2 text-left">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2">{children}</td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

const AIChatbot = ({ lectureId, lectureTitle }) => {
  const { isDark } = useTheme();
  const { userData } = useSelector((state) => state.user);
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [interactionId, setInteractionId] = useState(null);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch chat history for this lecture
  useEffect(() => {
    if (lectureId) {
      fetchChatHistory();
    }
  }, [lectureId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/chatbot/history/${lectureId}`,
        { withCredentials: true }
      );
      setChatHistory(response.data.chats || []);
    } catch (error) {
      console.log("Error fetching chat history:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call AI API with new Interactions API
      const response = await axios.post(
        `${BASE_URL}/api/chatbot/chat`,
        {
          message: inputMessage,
          lectureId,
          lectureTitle,
          chatHistory: messages,
          previousInteractionId: interactionId,
        },
        { withCredentials: true }
      );

      // Store the interaction ID for next request (stateful conversation)
      if (response.data.interactionId) {
        setInteractionId(response.data.interactionId);
      }

      const aiMessage = {
        role: "assistant",
        content: response.data.response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.log("Error sending message:", error);
      toast.error("Failed to get response. Please try again.");
      
      const errorMessage = {
        role: "assistant",
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChat = async () => {
    if (messages.length === 0) {
      toast.warning("No messages to save");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/chatbot/save`,
        {
          lectureId,
          lectureTitle,
          messages,
        },
        { withCredentials: true }
      );

      toast.success("Chat saved successfully!");
      fetchChatHistory();
    } catch (error) {
      console.log("Error saving chat:", error);
      toast.error("Failed to save chat");
    }
  };

  const handleLoadChat = async (chatId) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/chatbot/chat/${chatId}`,
        { withCredentials: true }
      );
      setMessages(response.data.chat.messages || []);
      setSelectedChatId(chatId);
      setInteractionId(null); // Reset interaction ID for loaded chats
      toast.success("Chat loaded successfully!");
    } catch (error) {
      console.log("Error loading chat:", error);
      toast.error("Failed to load chat");
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(
        `${BASE_URL}/api/chatbot/chat/${chatId}`,
        { withCredentials: true }
      );
      toast.success("Chat deleted successfully!");
      fetchChatHistory();
      
      if (selectedChatId === chatId) {
        setMessages([]);
        setSelectedChatId(null);
      }
    } catch (error) {
      console.log("Error deleting chat:", error);
      toast.error("Failed to delete chat");
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleToggleMessageFavorite = async (messageIndex) => {
    if (!selectedChatId) {
      toast.warning("Please save the chat first to favorite messages");
      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/api/chatbot/favorite/${selectedChatId}/${messageIndex}`,
        {},
        { withCredentials: true }
      );
      
      // Update local state
      const updatedMessages = [...messages];
      updatedMessages[messageIndex].isFavorite = !updatedMessages[messageIndex].isFavorite;
      setMessages(updatedMessages);
      
      toast.success(updatedMessages[messageIndex].isFavorite ? "Added to favorites" : "Removed from favorites");
    } catch (error) {
      console.log("Error toggling message favorite:", error);
      toast.error("Failed to toggle favorite");
    }
  };

  const handleToggleChatFavorite = async (chatId) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/chatbot/favorite/${chatId}`,
        {},
        { withCredentials: true }
      );
      
      fetchChatHistory();
      toast.success(response.data.message);
    } catch (error) {
      console.log("Error toggling chat favorite:", error);
      toast.error("Failed to toggle favorite");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`${isFullScreen ? "fixed inset-0 z-50" : ""} ${isDark ? "bg-gray-900" : "bg-white"} rounded-3xl border ${isDark ? "border-gray-800" : "border-gray-200"} overflow-hidden flex flex-col`}>
      
      {/* HEADER */}
      <div className={`p-4 border-b ${isDark ? "border-gray-800" : "border-gray-200"} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center">
            <FaRobot className="text-white text-lg" />
          </div>
          <div>
            <h2 className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              AI Chatbot
            </h2>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {lectureTitle || "Lecture Assistant"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
            title="Toggle History"
          >
            <FaHistory />
          </button>

          <button
            onClick={handleSaveChat}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
            title="Save Chat"
          >
            <FaSave />
          </button>

          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
            title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
          >
            {isFullScreen ? <FaCompress /> : <FaExpand />}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* CHAT HISTORY SIDEBAR */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`border-r ${isDark ? "border-gray-800 bg-gray-900/50" : "border-gray-200 bg-gray-50"} overflow-hidden flex flex-col`}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Chat History
                </h3>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {chatHistory.length} saved chats
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      No saved chats yet
                    </p>
                  </div>
                ) : (
                  chatHistory.map((chat) => (
                    <div
                      key={chat._id}
                      onClick={() => handleLoadChat(chat._id)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${selectedChatId === chat._id ? (isDark ? "bg-violet-500/20 border border-violet-500/30" : "bg-violet-100 border border-violet-300") : (isDark ? "hover:bg-gray-800" : "hover:bg-gray-200")}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                            {chat.messages[0]?.content?.substring(0, 30) || "New Chat"}...
                          </p>
                          <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                            {formatTime(chat.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleChatFavorite(chat._id);
                            }}
                            className={`${chat.isFavorite ? "text-yellow-500" : (isDark ? "text-gray-400 hover:text-yellow-500" : "text-gray-500 hover:text-yellow-500")} transition-colors`}
                          >
                            {chat.isFavorite ? <FaStar /> : <FaRegStar />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat._id);
                            }}
                            className="text-red-500 hover:text-red-600 transition-colors"
                          >
                            <FaTrash className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {messages.length > 0 && !selectedChatId && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={handleSaveChat}
                    className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-medium text-sm hover:opacity-90 transition-all"
                  >
                    Save Current Chat
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <FaRobot className={`text-3xl ${isDark ? "text-violet-400" : "text-violet-600"}`} />
                  </div>
                  <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Start a conversation
                  </h3>
                  <p className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                    Ask questions about this lecture or get help with your learning
                  </p>
                </div>
              </div>
            ) : (
              messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <FaRobot className="text-white text-sm" />
                    </div>
                  )}

                  <div className={`max-w-[85%] ${message.role === "user" ? (isDark ? "bg-violet-600" : "bg-violet-600") : (isDark ? "bg-gray-800" : "bg-gray-100")} rounded-2xl p-4 ${message.role === "assistant" ? "prose prose-sm max-w-none" : ""}`}>
                    {message.role === "assistant" ? (
                      <MarkdownRenderer content={message.content} isDark={isDark} />
                    ) : (
                      <p className={`text-sm leading-6 ${message.role === "user" ? "text-white" : (isDark ? "text-gray-100" : "text-gray-900")}`}>
                        {message.content}
                      </p>
                    )}

                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => handleCopyMessage(message.content)}
                          className={`flex items-center gap-1 text-xs ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} transition-colors`}
                        >
                          <FaCopy />
                          Copy
                        </button>
                        <button
                          onClick={() => handleToggleMessageFavorite(index)}
                          className={`flex items-center gap-1 text-xs transition-colors ${message.isFavorite ? "text-yellow-500" : (isDark ? "text-gray-400 hover:text-yellow-500" : "text-gray-500 hover:text-yellow-500")}`}
                        >
                          {message.isFavorite ? <FaStar /> : <FaRegStar />}
                          {message.isFavorite ? "Favorited" : "Favorite"}
                        </button>
                        <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <img
                      src={userData?.photoUrl || "/default-avatar.png"}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                </motion.div>
              ))
            )}

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <FaRobot className="text-white text-sm" />
                </div>
                <div className={`${isDark ? "bg-gray-800" : "bg-gray-100"} rounded-2xl p-4`}>
                  <ClipLoader size={20} color="#7c3aed" />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className={`p-4 border-t ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <div className="flex gap-3">
              <textarea
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={2}
                className={`flex-1 rounded-2xl border p-4 outline-none resize-none transition-all ${isDark ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-violet-500" : "bg-gray-100 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-violet-500"}`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <ClipLoader size={18} color="#fff" /> : <FaPaperPlane />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbot;
