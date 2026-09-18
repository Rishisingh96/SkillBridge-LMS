# 🤖 AI Implementation Guide - SkillBridge LMS

**Complete A-Z Implementation of AI Chatbot with Google Gemini AI**

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [What is AI in this Project?](#what-is-ai-in-this-project)
3. [Tech Stack Used](#tech-stack-used)
4. [Architecture Diagram](#architecture-diagram)
5. [Step-by-Step Implementation](#step-by-step-implementation)
6. [Backend Implementation](#backend-implementation)
7. [Frontend Implementation](#frontend-implementation)
8. [Database Schema](#database-schema)
9. [API Endpoints](#api-endpoints)
10. [How It Works - Dry Run](#how-it-works---dry-run)
11. [Testing the AI Feature](#testing-the-ai-feature)
12. [Troubleshooting](#troubleshooting)
13. [Best Practices](#best-practices)

---

## 🎯 Overview

This guide explains how AI is implemented in the SkillBridge LMS project using **Google Gemini AI** (via `@google/genai` package). The AI feature is an **intelligent chatbot** that helps students understand lecture content by answering their questions in real-time.

### Key Features

- **Context-Aware Conversations**: AI knows which lecture the student is watching
- **Stateful Chats**: Maintains conversation context across multiple messages
- **Markdown Formatting**: AI responses are beautifully formatted like ChatGPT
- **Chat History**: Students can save, load, and manage their conversations
- **Favorites**: Mark important chats and messages as favorites
- **Real-Time Responses**: Fast AI responses using Google's Gemini model

---

## 🤔 What is AI in this Project?

### Understanding the AI Implementation

**AI (Artificial Intelligence)** in this project refers to a **Generative AI Chatbot** powered by Google's Gemini AI model. Here's what it does:

1. **Unders Student Questions**: When a student asks a question about a lecture, the AI understands the context
2. **Provides Intelligent Answers**: Uses Google Gemini AI to generate accurate, educational responses
3. **Maintains Context**: Remembers previous messages in the conversation for coherent dialogue
4. **Formats Responses**: Uses Markdown for beautiful, readable answers with headings, lists, code blocks, etc.

### Real-World Example

**Scenario**: A student is watching a lecture on "JavaScript Arrays" and asks:
- **Student**: "What is the difference between map() and forEach()?"
- **AI Response**: 
  ```
  ## map() vs forEach()

  **map()**: Creates a new array by transforming each element
  - Returns a new array
  - Doesn't modify the original array
  - Used when you need to transform data

  **forEach()**: Executes a function for each element
  - Returns undefined
  - Used for side effects like logging
  - Doesn't create a new array

  Example:
  ```javascript
  // map() example
  const doubled = [1, 2, 3].map(x => x * 2); // [2, 4, 6]
  
  // forEach() example
  [1, 2, 3].forEach(x => console.log(x)); // logs 1, 2, 3
  ```
  ```

---

## 🛠 Tech Stack Used

### Backend AI Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **@google/genai** | Google Generative AI SDK | ^2.16.0 |
| **Google Gemini AI** | AI Model for generating responses | gemini-3.6-flash |
| **Express.js** | Backend API framework | ^5.2.1 |
| **MongoDB** | Database for storing chat history | - |
| **Mongoose** | ODM for MongoDB | ^9.6.1 |

### Frontend AI Technologies

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Library | ^18.3.1 |
| **Axios** | HTTP Client for API calls | ^1.16.0 |
| **React Markdown** | Markdown rendering for AI responses | ^10.1.0 |
| **remark-gfm** | GitHub Flavored Markdown support | ^4.0.1 |
| **Framer Motion** | Animations for chat interface | ^12.40.0 |
| **React Toastify** | Toast notifications | ^11.1.0 |

---

## 🏗 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           AIChatbot Component                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ Chat Interface│  │ Markdown     │  │ Chat      │ │  │
│  │  │ (User Input) │  │ Renderer     │  │ History   │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │ HTTP Request                       │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         chatbotController.js                         │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │  │
│  │  │ chatWithAI   │  │ saveChat     │  │ getChat   │ │  │
│  │  │ Function     │  │ Function     │  │ History   │ │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                     │
│  ┌─────────────────────▼───────────────────────────────┐   │
│  │           Google GenAI SDK (@google/genai)          │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Google Gemini AI Model (gemini-3.6-flash)   │  │   │
│  │  │  - Processes user messages                  │  │   │
│  │  │  - Generates intelligent responses           │  │   │
│  │  │  - Maintains conversation context            │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                     │
│  ┌─────────────────────▼───────────────────────────────┐   │
│  │              MongoDB Database                       │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │  Chat Model (chatboatModel.js)                │  │   │
│  │  │  - Stores chat history                        │  │   │
│  │  │  - User & Lecture references                  │  │   │
│  │  │  - Messages array with timestamps             │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 Step-by-Step Implementation

### Phase 1: Setup & Dependencies

#### Step 1.1: Install AI Package in Backend

```bash
cd backend
npm install @google/genai
```

**What this does:**
- Installs Google's Generative AI SDK
- This SDK allows us to communicate with Google's AI models (Gemini)

#### Step 1.2: Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Create a new project or use existing one
4. Go to API Keys section
5. Generate a new API key
6. Copy the API key

#### Step 1.3: Add API Key to Environment Variables

Add this to your `backend/.env` file:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Why this is needed:**
- The API key authenticates your application with Google's AI services
- Without this, you cannot use the Gemini AI model

---

### Phase 2: Backend Implementation

#### Step 2.1: Create Database Model for Chats

**File**: `backend/models/chatboatModel.js`

```javascript
import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  lectureId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lecture',
    required: true,
  },
  lectureTitle: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  }],
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

chatSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

export default mongoose.model('Chat', chatSchema);
```

**Explanation:**
- **lectureId**: Links chat to a specific lecture
- **lectureTitle**: Stores lecture title for context
- **userId**: Links chat to the user who created it
- **messages**: Array of conversation messages
  - **role**: Either 'user' or 'assistant'
  - **content**: The actual message text
  - **timestamp**: When the message was sent
  - **isFavorite**: Whether message is favorited
- **isFavorite**: Whether the entire chat is favorited
- **timestamps**: Auto-updates on save

#### Step 2.2: Create AI Controller

**File**: `backend/controller/chatbotController.js`

```javascript
import Chat from '../models/chatboatModel.js';
import { GoogleGenAI } from '@google/genai';

// =========================
// CHAT WITH AI
// =========================
export const chatWithAI = async (req, res) => {
  try {
    const { message, lectureId, lectureTitle, previousInteractionId } = req.body;

    if (!message || !lectureId) {
      return res.status(400).json({
        success: false,
        message: 'Message and lectureId are required',
      });
    }

    // Validate GEMINI_API_KEY
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY is not configured in environment variables',
      });
    }

    // Initialize GEMINI AI
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Build conversation context
    const systemPrompt = `You are a helpful AI assistant for a lecture titled: "${lectureTitle}". 
    Help students understand the content, answer their questions, and provide clear explanations.
    Be concise, accurate, and educational in your responses.

    IMPORTANT: Format your responses using Markdown for better readability:
    - Use **bold** for key terms and important concepts
    - Use *italic* for emphasis
    - Use ## for main sections and ### for subsections
    - Use bullet points (• or *) for lists
    - Use numbered lists (1., 2., 3.) for sequential information
    - Use \`code\` for technical terms or short code snippets
    - Use > for important notes or warnings
    - Use --- for horizontal rules to separate sections
    - Keep paragraphs short and well-spaced

    Make your responses visually appealing and easy to read, similar to how ChatGPT formats its answers.`;

    // Prepare input with system prompt and user message
    const input = [
      { type: "text", text: systemPrompt },
      { type: "text", text: message }
    ];

    // Create interaction using the Interactions API
    const interactionConfig = {
      model: "gemini-3.6-flash",
      input: input,
    };

    if (previousInteractionId) {
      interactionConfig.previous_interaction_id = previousInteractionId;
    }

    const interaction = await ai.interactions.create(interactionConfig);
    const aiResponse = interaction.output_text;

    res.status(200).json({
      success: true,
      response: aiResponse,
      interactionId: interaction.id,
    });
  } catch (error) {
    console.log('Error in chatWithAI:', error);
    
    let errorMessage = 'Failed to get AI response';
    if (error.message.includes('404') || error.message.includes('not found')) {
      errorMessage = 'AI model not found or not supported. Please check the model configuration.';
    } else if (error.message.includes('401') || error.message.includes('403')) {
      errorMessage = 'Invalid API key or authentication failed. Please check your GEMINI_API_KEY.';
    } else if (error.message.includes('API key')) {
      errorMessage = 'Invalid API key format. Please check your GEMINI_API_KEY.';
    } else if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exceeded')) {
      errorMessage = 'API quota exceeded. Please check your Google Cloud billing and quota settings at https://ai.dev/rate-limit';
    }
    
    res.status(500).json({
      success: false,
      success: false,
      message: errorMessage,
      error: error.message,
    });
  }
};

// =========================
// SAVE CHAT
// =========================
export const saveChat = async (req, res) => {
  try {
    const { lectureId, lectureTitle, messages } = req.body;
    const userId = req.user._id;

    if (!lectureId || !messages || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'LectureId and messages are required',
      });
    }

    const chat = await Chat.create({
      lectureId,
      lectureTitle,
      userId,
      messages,
    });

    res.status(201).json({
      success: true,
      message: 'Chat saved successfully',
      chat,
    });
  } catch (error) {
    console.log('Error in saveChat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save chat',
    });
  }
};

// =========================
// GET CHAT HISTORY FOR LECTURE
// =========================
export const getChatHistory = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.user._id;

    const chats = await Chat.find({
      lectureId,
      userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log('Error in getChatHistory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat history',
    });
  }
};

// =========================
// GET SINGLE CHAT
// =========================
export const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    console.log('Error in getChat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat',
    });
  }
};

// =========================
// DELETE CHAT
// =========================
export const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOneAndDelete({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully',
    });
  } catch (error) {
    console.log('Error in deleteChat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete chat',
    });
  }
};

// =========================
// GET ALL USER CHATS
// =========================
export const getAllUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log('Error in getAllUserChats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user chats',
    });
  }
};

// =========================
// TOGGLE CHAT FAVORITE
// =========================
export const toggleChatFavorite = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    chat.isFavorite = !chat.isFavorite;
    await chat.save();

    res.status(200).json({
      success: true,
      message: chat.isFavorite ? 'Chat added to favorites' : 'Chat removed from favorites',
      chat,
    });
  } catch (error) {
    console.log('Error in toggleChatFavorite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle favorite',
    });
  }
};

// =========================
// TOGGLE MESSAGE FAVORITE
// =========================
export const toggleMessageFavorite = async (req, res) => {
  try {
    const { chatId, messageIndex } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    if (!chat.messages[messageIndex]) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    chat.messages[messageIndex].isFavorite = !chat.messages[messageIndex].isFavorite;
    await chat.save();

    res.status(200).json({
      success: true,
      message: chat.messages[messageIndex].isFavorite ? 'Message added to favorites' : 'Message removed from favorites',
      chat,
    });
  } catch (error) {
    console.log('Error in toggleMessageFavorite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle message favorite',
    });
  }
};

// =========================
// GET FAVORITE CHATS
// =========================
export const getFavoriteChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      userId,
      isFavorite: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.log('Error in getFavoriteChats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorite chats',
    });
  }
};
```

**Key Functions Explained:**

1. **chatWithAI**: 
   - Receives user message and lecture context
   - Initializes Google GenAI with API key
   - Creates a system prompt for context
   - Calls Gemini AI model to generate response
   - Returns AI response with interaction ID for stateful conversation

2. **saveChat**: 
   - Saves entire conversation to database
   - Links to user and lecture
   - Stores all messages with timestamps

3. **getChatHistory**: 
   - Fetches all saved chats for a specific lecture
   - Returns sorted by creation date (newest first)

4. **getChat**: 
   - Fetches a single chat by ID
   - Ensures user owns the chat

5. **deleteChat**: 
   - Deletes a chat from database
   - Only allows deletion by chat owner

6. **toggleChatFavorite**: 
   - Marks/unmarks entire chat as favorite
   - Useful for quick access to important conversations

7. **toggleMessageFavorite**: 
   - Marks/unmarks specific message as favorite
   - Useful for highlighting important AI responses

8. **getFavoriteChats**: 
   - Fetches all favorited chats for a user
   - Sorted by creation date

#### Step 2.3: Create API Routes

**File**: `backend/routes/chatbotRoute.js`

```javascript
import express from "express";
import {
  chatWithAI,
  saveChat,
  getChatHistory,
  getChat,
  deleteChat,
  getAllUserChats,
  toggleChatFavorite,
  toggleMessageFavorite,
  getFavoriteChats,
} from "../controller/chatbotController.js";
import isAuth from "../middleware/isAuth.js";

const router = express.Router();

// Chat with AI
router.post("/chat", isAuth, chatWithAI);

// Save chat
router.post("/save", isAuth, saveChat);

// Get chat history for a specific lecture
router.get("/history/:lectureId", isAuth, getChatHistory);

// Get a specific chat
router.get("/chat/:chatId", isAuth, getChat);

// Delete a chat
router.delete("/chat/:chatId", isAuth, deleteChat);

// Get all user chats
router.get("/all-chats", isAuth, getAllUserChats);

// Toggle chat favorite
router.put("/favorite/:chatId", isAuth, toggleChatFavorite);

// Toggle message favorite
router.put("/favorite/:chatId/:messageIndex", isAuth, toggleMessageFavorite);

// Get favorite chats
router.get("/favorites", isAuth, getFavoriteChats);

export default router;
```

**Explanation:**
- Each route is protected with `isAuth` middleware (user must be logged in)
- Routes follow RESTful conventions
- All routes are prefixed with `/api/chatbot`

#### Step 2.4: Register Routes in Main App

**File**: `backend/index.js`

Add these lines:

```javascript
// Import chatbot routes
import chatbotRouter from "./routes/chatbotRoute.js";

// Import chat model
import "./models/chatboatModel.js";

// Register routes
app.use("/api/chatbot", chatbotRouter);
```

---

### Phase 3: Frontend Implementation

#### Step 3.1: Install Frontend Dependencies

```bash
cd frontend
npm install react-markdown remark-gfm
```

**What these do:**
- **react-markdown**: Renders Markdown text in React
- **remark-gfm**: Adds GitHub Flavored Markdown support (tables, task lists, etc.)

#### Step 3.2: Create AI Chatbot Component

**File**: `frontend/src/components/lecture/AIChatbot.jsx`

```javascript
import React, { useState, useEffect, useRef } from "react";
import { FaRobot, FaPaperPlane, FaCopy, FaSave, FaExpand, FaCompress, FaTrash, FaHistory, FaStar, FaRegStar, FaPlus, FaEraser } from "react-icons/fa";
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
      // Call AI API
      const response = await axios.post(
        `${BASE_URL}/api/chatbot/chat`,
        {
          message: inputMessage,
          lectureId,
          lectureTitle,
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
      setInteractionId(null);
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

  const handleNewChat = () => {
    setMessages([]);
    setSelectedChatId(null);
    setInteractionId(null);
    setInputMessage("");
    toast.success("New chat started!");
  };

  const handleClearChat = () => {
    if (messages.length === 0) {
      toast.warning("No messages to clear");
      return;
    }
    setMessages([]);
    setSelectedChatId(null);
    setInteractionId(null);
    toast.success("Chat cleared!");
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
            onClick={handleNewChat}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
            title="New Chat"
          >
            <FaPlus />
          </button>

          <button
            onClick={handleClearChat}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isDark ? "bg-gray-800 hover:bg-gray-700 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
            title="Clear Chat"
          >
            <FaEraser />
          </button>

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
```

**Component Features:**

1. **MarkdownRenderer**: Custom component to render AI responses with beautiful formatting
2. **State Management**: 
   - `messages`: Current conversation messages
   - `inputMessage`: User's typed message
   - `isLoading`: Loading state for AI response
   - `chatHistory`: Saved chats for the lecture
   - `interactionId`: For stateful conversations
3. **Functions**:
   - `handleSendMessage`: Sends message to AI and gets response
   - `handleSaveChat`: Saves conversation to database
   - `handleLoadChat`: Loads saved chat
   - `handleDeleteChat`: Deletes saved chat
   - `handleToggleMessageFavorite`: Favorites specific message
   - `handleToggleChatFavorite`: Favorites entire chat
4. **UI Features**:
   - Chat history sidebar
   - Full-screen mode
   - Dark/light theme support
   - Copy message to clipboard
   - Auto-scroll to latest message
   - Loading spinner during AI response

#### Step 3.3: Integrate Chatbot in Lecture Player

**File**: `frontend/src/components/lecture/LecturePlayer.jsx`

Add the AI Chatbot component:

```javascript
import AIChatbot from "./AIChatbot";

// In your component JSX:
<AIChatbot 
  lectureId={currentLecture._id} 
  lectureTitle={currentLecture.title} 
/>
```

---

## 🗄 Database Schema

### Chat Collection Structure

```javascript
{
  _id: ObjectId,
  lectureId: ObjectId,           // Reference to Lecture
  lectureTitle: String,          // Lecture title for context
  userId: ObjectId,              // Reference to User
  messages: [
    {
      role: String,              // 'user' or 'assistant'
      content: String,           // Message text
      timestamp: Date,           // When message was sent
      isFavorite: Boolean        // Whether message is favorited
    }
  ],
  isFavorite: Boolean,           // Whether chat is favorited
  createdAt: Date,               // When chat was created
  updatedAt: Date                // When chat was last updated
}
```

### Indexes for Performance

```javascript
// Compound index for efficient queries
db.chats.createIndex({ userId: 1, lectureId: 1, createdAt: -1 })
db.chats.createIndex({ userId: 1, isFavorite: 1, createdAt: -1 })
```

---

## 🔌 API Endpoints

### Chat with AI

**Endpoint**: `POST /api/chatbot/chat`

**Request Body**:
```json
{
  "message": "What is the difference between map() and forEach()?",
  "lectureId": "lecture_id_here",
  "lectureTitle": "JavaScript Arrays",
  "previousInteractionId": "optional_interaction_id"
}
```

**Response**:
```json
{
  "success": true,
  "response": "## map() vs forEach()\n\n**map()**: Creates a new array...",
  "interactionId": "interaction_id_for_next_request"
}
```

### Save Chat

**Endpoint**: `POST /api/chatbot/save`

**Request Body**:
```json
{
  "lectureId": "lecture_id_here",
  "lectureTitle": "JavaScript Arrays",
  "messages": [
    {
      "role": "user",
      "content": "What is map()?",
      "timestamp": "2024-01-01T10:00:00Z"
    },
    {
      "role": "assistant",
      "content": "map() creates a new array...",
      "timestamp": "2024-01-01T10:00:01Z"
    }
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Chat saved successfully",
  "chat": {
    "_id": "chat_id_here",
    "lectureId": "lecture_id_here",
    "messages": [...],
    "createdAt": "2024-01-01T10:00:02Z"
  }
}
```

### Get Chat History

**Endpoint**: `GET /api/chatbot/history/:lectureId`

**Response**:
```json
{
  "success": true,
  "chats": [
    {
      "_id": "chat_id_1",
      "lectureId": "lecture_id_here",
      "messages": [...],
      "isFavorite": true,
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Get Single Chat

**Endpoint**: `GET /api/chatbot/chat/:chatId`

**Response**:
```json
{
  "success": true,
  "chat": {
    "_id": "chat_id_here",
    "messages": [...],
    "isFavorite": false
  }
}
```

### Delete Chat

**Endpoint**: `DELETE /api/chatbot/chat/:chatId`

**Response**:
```json
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

### Toggle Chat Favorite

**Endpoint**: `PUT /api/chatbot/favorite/:chatId`

**Response**:
```json
{
  "success": true,
  "message": "Chat added to favorites",
  "chat": {
    "_id": "chat_id_here",
    "isFavorite": true
  }
}
```

### Toggle Message Favorite

**Endpoint**: `PUT /api/chatbot/favorite/:chatId/:messageIndex`

**Response**:
```json
{
  "success": true,
  "message": "Message added to favorites",
  "chat": {
    "_id": "chat_id_here",
    "messages": [
      {
        "role": "assistant",
        "content": "...",
        "isFavorite": true
      }
    ]
  }
}
```

### Get Favorite Chats

**Endpoint**: `GET /api/chatbot/favorites`

**Response**:
```json
{
  "success": true,
  "chats": [
    {
      "_id": "chat_id_1",
      "isFavorite": true,
      "messages": [...]
    }
  ]
}
```

---

## 🔄 How It Works - Dry Run

### Complete Flow from User Question to AI Response

#### Step 1: User Asks a Question

**User Action**: Student types "What is React?" in the chatbot input field and presses Enter.

**Frontend State Changes**:
```javascript
// Before
messages = []
inputMessage = ""

// After
messages = [
  {
    role: "user",
    content: "What is React?",
    timestamp: "2024-01-15T10:30:00Z"
  }
]
inputMessage = ""
isLoading = true
```

#### Step 2: Frontend Sends API Request

**HTTP Request**:
```http
POST http://localhost:5000/api/chatbot/chat
Content-Type: application/json
Cookie: jwt_token=xyz123

{
  "message": "What is React?",
  "lectureId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "lectureTitle": "Introduction to React",
  "previousInteractionId": null
}
```

#### Step 3: Backend Receives Request

**Controller Function**: `chatWithAI` in `chatbotController.js`

```javascript
// Request received
req.body = {
  message: "What is React?",
  lectureId: "65a1b2c3d4e5f6g7h8i9j0k1",
  lectureTitle: "Introduction to React",
  previousInteractionId: null
}

// User authenticated via isAuth middleware
req.user._id = "user_id_here"
```

#### Step 4: Backend Validates Request

```javascript
// Check required fields
if (!message || !lectureId) {
  return error response
}

// Check API key
if (!process.env.GEMINI_API_KEY) {
  return error response
}
```

#### Step 5: Backend Initializes AI

```javascript
// Initialize Google GenAI
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY 
});

// Build system prompt for context
const systemPrompt = `You are a helpful AI assistant for a lecture titled: "Introduction to React". 
Help students understand the content, answer their questions, and provide clear explanations.
Be concise, accurate, and educational in your responses.

IMPORTANT: Format your responses using Markdown for better readability:
- Use **bold** for key terms and important concepts
- Use *italic* for emphasis
- Use ## for main sections and ### for subsections
...`;
```

#### Step 6: Backend Calls Google Gemini AI

```javascript
// Prepare input
const input = [
  { type: "text", text: systemPrompt },
  { type: "text", text: "What is React?" }
];

// Create interaction
const interactionConfig = {
  model: "gemini-3.6-flash",
  input: input,
};

const interaction = await ai.interactions.create(interactionConfig);
```

#### Step 7: Google AI Processes Request

**What happens at Google's servers:**
1. Receives the system prompt and user message
2. Understands the context (lecture about React)
3. Processes the question "What is React?"
4. Generates an intelligent, educational response)
5. Formats the response using Markdown
6. Returns the response to our backend

#### Step 8: Backend Receives AI Response

```javascript
// AI response received
const aiResponse = interaction.output_text;
/*
"## What is React?

**React** is a popular JavaScript library for building user interfaces, particularly single-page applications. It was developed by Facebook (now Meta) and released in 2013.

### Key Features

- **Component-Based**: Build encapsulated components that manage their own state
- **Declarative**: Design simple views for each state in your application
- **Virtual DOM**: Efficiently updates and renders components
- **Ecosystem**: Large community and extensive library support

### Example Component

```javascript
function Welcome() {
  return <h1>Hello, World!</h1>;
}
```

React makes it painless to create interactive UIs by allowing developers to design simple views for each state in their application."
*/

const interactionId = interaction.id; // "interaction_12345"
```

#### Step 9: Backend Sends Response to Frontend

```javascript
// Send response
res.status(200).json({
  success: true,
  response: aiResponse,
  interactionId: interactionId
});
```

**HTTP Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "response": "## What is React?\n\n**React** is a popular JavaScript library...",
  "interactionId": "interaction_12345"
}
```

#### Step 10: Frontend Receives Response

```javascript
// Response received
response.data = {
  success: true,
  response: "## What is React?\n\n**React** is a popular JavaScript library...",
  interactionId: "interaction_12345"
}

// Update state
setInteractionId("interaction_12345")

const aiMessage = {
  role: "assistant",
  content: response.data.response,
  timestamp: new Date().toISOString()
}

setMessages(prev => [...prev, aiMessage])
setIsLoading(false)
```

#### Step 11: Frontend Renders AI Response

**UI Update**:
```javascript
// Messages array now contains:
messages = [
  {
    role: "user",
    content: "What is React?",
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    role: "assistant",
    content: "## What is React?\n\n**React** is a popular JavaScript library...",
    timestamp: "2024-01-15T10:30:02Z"
  }
]

// MarkdownRenderer component renders:
// - H2 heading "What is React?"
// - Bold text for "React"
// - Bullet points for features
// - Code block for example
// - All with beautiful styling
```

#### Step 12: User Sees Formatted Response

**What the user sees**:
- Beautifully formatted response with:
  - Large heading "What is React?"
  - Bold key terms
  - Bullet points for features
  - Code block with syntax highlighting
  - Professional ChatGPT-like styling
- Copy button to copy the response
- Favorite button to mark as important
- Timestamp showing when response was received

---

### Complete Flow for Saving a Chat

#### Step 1: User Clicks Save Button

**User Action**: Student clicks the "Save Chat" button.

#### Step 2: Frontend Sends Save Request

```javascript
// Function called
const handleSaveChat = async () => {
  const response = await axios.post(
    `${BASE_URL}/api/chatbot/save`,
    {
      lectureId: "65a1b2c3d4e5f6g7h8i9j0k1",
      lectureTitle: "Introduction to React",
      messages: [
        {
          role: "user",
          content: "What is React?",
          timestamp: "2024-01-15T10:30:00Z"
        },
        {
          role: "assistant",
          content: "## What is React?\n\n**React** is a popular...",
          timestamp: "2024-01-15T10:30:02Z"
        }
      ]
    },
    { withCredentials: true }
  );
}
```

#### Step 3: Backend Saves to Database

```javascript
// Controller function
export const saveChat = async (req, res) => {
  const { lectureId, lectureTitle, messages } = req.body;
  const userId = req.user._id;

  const chat = await Chat.create({
    lectureId,
    lectureTitle,
    userId,
    messages,
  });

  res.status(201).json({
    success: true,
    message: 'Chat saved successfully',
    chat,
  });
}
```

#### Step 4: Database Record Created

**MongoDB Document**:
```javascript
{
  _id: ObjectId("65a1b2c3d4e5f6g7h8i9j0k2"),
  lectureId: ObjectId("65a1b2c3d4e5f6g7h8i9j0k1"),
  lectureTitle: "Introduction to React",
  userId: ObjectId("user_id_here"),
  messages: [
    {
      role: "user",
      content: "What is React?",
      timestamp: ISODate("2024-01-15T10:30:00Z"),
      isFavorite: false
    },
    {
      role: "assistant",
      content: "## What is React?\n\n**React** is a popular...",
      timestamp: ISODate("2024-01-15T10:30:02Z"),
      isFavorite: false
    }
  ],
  isFavorite: false,
  createdAt: ISODate("2024-01-15T10:30:05Z"),
  updatedAt: ISODate("2024-01-15T10:30:05Z")
}
```

#### Step 5: Frontend Updates Chat History

```javascript
// Success response received
toast.success("Chat saved successfully!");

// Refresh chat history
fetchChatHistory();

// Chat history sidebar now shows the saved chat
```

---

## 🧪 Testing the AI Feature

### Manual Testing Steps

#### Test 1: Basic AI Chat

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to a Lecture Page**
   - Open browser to `http://localhost:5173`
   - Login as a student
   - Navigate to any course lecture

4. **Test AI Chatbot**
   - Locate the AI Chatbot panel
   - Type a question related to the lecture
   - Press Enter or click Send button
   - Verify:
     - Loading spinner appears
     - AI response is received
     - Response is formatted with Markdown
     - Response is relevant to the lecture topic

#### Test 2: Chat History

1. **Save a Chat**
   - Have a conversation with the AI
   - Click the "Save Chat" button
   - Verify success toast appears
   - Verify chat appears in history sidebar

2. **Load a Saved Chat**
   - Click on a saved chat in the history
   - Verify messages load correctly
   - Verify you can continue the conversation

3. **Delete a Chat**
   - Click the delete icon on a saved chat
   - Verify confirmation (if any)
   - Verify chat is removed from history

#### Test 3: Favorites

1. **Favorite a Chat**
   - Click the star icon on a saved chat
   - Verify star becomes filled (yellow)
   - Verify success toast appears

2. **Favorite a Message**
   - Click the star icon on an AI response
   - Verify star becomes filled (yellow)
   - Verify "Favorited" text appears

3. **View Favorite Chats**
   - Navigate to favorites section (if implemented)
   - Verify favorited chats appear

#### Test 4: Stateful Conversation

1. **Start a Conversation**
   - Ask: "What is React?"
   - Wait for response

2. **Follow-up Question**
   - Ask: "How do I install it?"
   - Verify AI understands the context (React)
   - Response should be relevant to React installation

3. **Another Follow-up**
   - Ask: "What about Vue?"
   - Verify AI can switch context if needed

#### Test 5: Error Handling

1. **Test Without API Key**
   - Remove or invalidate `GEMINI_API_KEY` from .env
   - Try to send a message
   - Verify appropriate error message appears

2. **Test Empty Message**
   - Try to send an empty message
   - Verify nothing happens or appropriate error

3. **Test Network Error**
   - Disconnect internet
   - Try to send a message
   - Verify error toast appears

---

## 🔧 Troubleshooting

### Common Issues and Solutions

#### Issue 1: "GEMINI_API_KEY is not configured"

**Cause**: API key is missing from `.env` file

**Solution**:
1. Get API key from [Google AI Studio](https://aistudio.google.com/)
2. Add to `backend/.env`:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Restart backend server

#### Issue 2: "Invalid API key or authentication failed"

**Cause**: API key is incorrect or expired

**Solution**:
1. Verify API key is correct
2. Generate a new API key from Google AI Studio
3. Update `.env` file
4. Restart backend server

#### Issue 3: "API quota exceeded"

**Cause**: Free tier quota limit reached

**Solution**:
1. Check quota at [Google Cloud Console](https://console.cloud.google.com/)
2. Enable billing for higher limits
3. Wait for quota to reset (usually daily)
4. Consider upgrading to paid tier

#### Issue 4: AI responses are slow

**Cause**: Network latency or high server load

**Solution**:
1. Check internet connection
2. Use faster AI model (gemini-3.6-flash is already fast)
3. Implement caching for common questions
4. Show loading indicator to user

#### Issue 5: Markdown not rendering correctly

**Cause**: Missing frontend dependencies

**Solution**:
```bash
cd frontend
npm install react-markdown remark-gfm
```

#### Issue 6: Chat history not loading

**Cause**: Database connection issue or authentication error

**Solution**:
1. Check MongoDB is running
2. Verify user is authenticated
3. Check browser console for errors
4. Verify API endpoint is correct

#### Issue 7: "AI model not found or not supported"

**Cause**: Model name is incorrect or deprecated

**Solution**:
1. Check current model names in Google AI documentation
2. Update model name in `chatbotController.js`
3. Currently using: `gemini-3.6-flash`
4. Alternative: `gemini-3.6-pro`

---

## 📚 Best Practices

### For Backend

1. **Always validate API key presence** before initializing AI
2. **Use system prompts** to provide context to the AI
3. **Handle errors gracefully** with specific error messages
4. **Log errors** for debugging
5. **Implement rate limiting** to prevent API abuse
6. **Cache common responses** to reduce API calls
7. **Sanitize user input** before sending to AI

### For Frontend

1. **Show loading states** during AI responses
2. **Handle errors gracefully** with user-friendly messages
3. **Implement auto-scroll** to latest message
4. **Provide copy functionality** for AI responses
5. **Allow users to save important conversations**
6. **Implement markdown rendering** for better readability
7. **Support dark/light themes** for better UX

### For AI Integration

1. **Provide context** to the AI (lecture title, topic)
2. **Format responses** with Markdown for readability
3. **Maintain conversation state** using interaction IDs
4. **Set appropriate system prompts** for desired behavior
5. **Monitor API usage** to stay within quotas
6. **Implement fallback responses** for errors
7. **Test with various user inputs** for robustness

### For Database

1. **Create indexes** for frequently queried fields
2. **Implement data validation** at schema level
3. **Use references** for related documents
4. **Implement soft delete** if needed
5. **Archive old chats** to manage database size
6. **Regular backups** of chat data

---

## 🎯 Summary

### What We Implemented

1. **AI Chatbot** using Google Gemini AI
2. **Context-aware conversations** tied to lectures
3. **Stateful conversations** with interaction IDs
4. **Markdown-formatted responses** like ChatGPT
5. **Chat history management** (save, load, delete)
6. **Favorites system** for chats and messages
7. **Beautiful UI** with animations and dark mode
8. **Error handling** and user feedback
9. **Database storage** for chat persistence

### Key Technologies

- **Backend**: Node.js, Express, MongoDB, @google/genai
- **Frontend**: React, React Markdown, Framer Motion
- **AI**: Google Gemini AI (gemini-3.6-flash)
- **Database**: MongoDB with Mongoose

### Learning Outcomes

As a fresher, you've learned:

1. **How to integrate AI APIs** into a web application
2. **How to manage conversation state** in chat applications
3. **How to render Markdown** in React
4. **How to design chat interfaces** with good UX
5. **How to handle API errors** gracefully
6. **How to implement favorites** and history features
7. **How to use environment variables** for sensitive data
8. **How to structure backend controllers** and routes

---

## 🚀 Next Steps

### Potential Enhancements

1. **Voice Input**: Add speech-to-text for asking questions
2. **Voice Output**: Add text-to-speech for AI responses
3. **Code Execution**: Allow AI to run code snippets
4. **Image Support**: Add image analysis capabilities
5. **Multi-language**: Support for different languages
6. **Export Chats**: Allow users to export conversations
7. **Share Chats**: Allow sharing conversations with others
8. **AI Models**: Support multiple AI models (GPT, Claude, etc.)

### Advanced Features

1. **RAG (Retrieval Augmented Generation)**: Use lecture content as context
2. **Fine-tuning**: Train AI on course-specific content
3. **Analytics**: Track AI usage and popular questions
4. **Feedback System**: Allow users to rate AI responses
5. **Smart Suggestions**: Suggest relevant questions based on lecture

---

## 📞 Support

If you face any issues:

1. Check the [Google AI Documentation](https://ai.google.dev/docs)
2. Review the error messages in browser console
3. Check backend logs for detailed errors
4. Verify all environment variables are set correctly
5. Ensure MongoDB is running and accessible

---

**Happy Learning! 🎓**
