import Chat from '../models/chatboatModel.js';
import { GoogleGenAI } from '@google/genai';

// =========================
// CHAT WITH AI
// =========================
export const chatWithAI = async (req, res) => {
  try {
    console.log("===== CHATBOT DEBUG =====");
    console.log("Request body:", req.body);
    console.log("User:", req.user);
    
    const { message, lectureId, lectureTitle, previousInteractionId } = req.body;

    if (!message || !lectureId) {
      console.log("Validation failed - message:", message, "lectureId:", lectureId);
      return res.status(400).json({
        success: false,
        message: 'Message and lectureId are required',
        received: { message, lectureId, lectureTitle }
      });
    }

    // Validate GEMINI_API_KEY
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'GEMINI_API_KEY is not configured in environment variables',
      });
    }

    // Initialize GEMINI AI with new Interactions API
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

    // Create interaction using the new Interactions API
    // Use previousInteractionId if available for stateful conversation
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
      interactionId: interaction.id, // Send interaction ID for next request
    });
  } catch (error) {
    console.log('Error in chatWithAI:', error);
    
    // Provide specific error messages based on the error type
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
