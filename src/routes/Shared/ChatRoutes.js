const express = require('express');
const routes = express.Router();
const ChatControllers = require('../../controllers/Shared/ChatControllers');
const {verifyToken} = require("../../middleware/authMiddleware");

routes.get("/chats", verifyToken ,ChatControllers.getChats);

routes.post("/chats", verifyToken,ChatControllers.sendMessage);

routes.get("/messages/history", verifyToken, ChatControllers.getMessagesHistory);

module.exports = routes