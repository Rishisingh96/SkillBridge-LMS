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
