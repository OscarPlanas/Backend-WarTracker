import { Request, Response } from 'express';
import Chat from '../model/Chat';
import User from '../model/User';

// Function to create a new chat between users
const create = async (req: Request, res: Response) => {
    const { idUserOpening, idUserReceiver } = req.body;
    try {
        const clientOpening = await User.findById(idUserOpening);
        const clientRecieving = await User.findById(idUserReceiver);
        const newChat = new Chat({
            client1: clientOpening?._id,
            client2: clientRecieving?._id,
            messages: []
        });
        await newChat.save().catch(Error);
        res.status(200).json({ status: 'Chat saved' });

    }
    catch (err) {
        return res.status(400).json({ message: 'Could not create chat', err });
    }
};

// Function to get all chats with populated client information
const getall = async (req: Request, res: Response) => {
    const chats = await Chat.find().populate('client1').populate('client2');
    res.json(chats);
};

// Function to get all chats associated with a specific user
const getAllChatsOfUser = async (req: Request, res: Response) => {
    const idUser = req.params.id_user;
    const chats = await Chat.find({ $or: [{ client1: idUser }, { client2: idUser }] }).populate('client1').populate('client2');
    res.json(chats);
};

// Function to get a chat between two specific users
const getChatByUsers = async (req: Request, res: Response) => {
    const idUserOpening = req.params.id_user_opening;
    const idUserReceiver = req.params.id_user_receiver;

    const chat = await Chat.find({ $or: [{ client1: idUserOpening, client2: idUserReceiver }, { client1: idUserReceiver, client2: idUserOpening }] }).populate('client1').populate('client2');
    res.json(chat);
};
    
// Function to get a single chat by its ID
const getone = async (req: Request, res: Response) => {
    const chat = await Chat.findById(req.params.id).populate('client1').populate('client2');
    if (!chat) {
        return res.status(404).send('The chat does not exist');
    }
    res.json(chat);
};

const deleteChat = async (req: Request, res: Response) => {
    const chat = await Chat.findByIdAndDelete(req.params.id_chat);
    if (!chat) {
        return res.status(404).send('The chat does not exist');
    }
    res.json({ message: 'Chat deleted' });
};


export default { create, getall, getone, getAllChatsOfUser, getChatByUsers, deleteChat };