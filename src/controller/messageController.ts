import { Request, Response } from 'express';
import Chat from '../model/Chat';
import User from '../model/User';
import Message from '../model/Message';

// Function to save a new message
const message = async (req: Request, res: Response) => {
    const { chat, user, message, date } = req.body;
    const chat1 = await Chat.findById(chat);
    const user1 = await User.findById(user);

    const newMessage = new Message({
        chat: chat1?._id,
        user: user1?._id,
        message: message,
        date: date
    });
    await newMessage.save().catch(Error);
    res.status(200).json({ status: 'Message saved' });
};

// Function to get all messages of a specific chat
const getAllMessagesofChat = async (req: Request, res: Response) => {
    const chat = req.params.id_chat;

    const messages = await Message.find({ chat: chat });

    res.json(messages);

};

// Function to get all messages with user population
const getAllMessages = async (req: Request, res: Response) => {
    const messages = await Message.find().populate('user');

    res.json(messages);

}

export default { message, getAllMessagesofChat, getAllMessages };

