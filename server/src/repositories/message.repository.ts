import mongoose from "mongoose";
import Message, { MessageInput } from "../models/message.model.js";

export const createMessage = async (data: MessageInput) => {
  const message = new Message(data);
  return await message.save();
};

export const createMessages = async (data: MessageInput[]) => {
  return await Message.insertMany(data);
};

export const getMessageByChatIdPaginated = async (
  chatId: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const messages = await Message.find({
    chatId: new mongoose.Types.ObjectId(chatId),
  })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(limit)
    .lean();

  const total = await Message.countDocuments({
    chatId: new mongoose.Types.ObjectId(chatId),
  });

  return {
    messages,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getRecentMessagesByChatId = async (chatId: string) => {
  return await Message.find({
    chatId: new mongoose.Types.ObjectId(chatId),
  })
    .sort({ createdAt: 1 })
    .limit(10)
    .lean();
};

export const getTotalMessagesByChatIdAndUser = async (
  chatId: string,
  userId: string,
) => {
  return await Message.countDocuments({
    chatId: new mongoose.Types.ObjectId(chatId),
    userId: new mongoose.Types.ObjectId(userId),
  });
};

export const deleteMessagesByChatAndUser = async (
  chatId: string,
  userId: string,
) => {
  return await Message.deleteMany({
    chatId: new mongoose.Types.ObjectId(chatId),
    userId: new mongoose.Types.ObjectId(userId),
  });
};
