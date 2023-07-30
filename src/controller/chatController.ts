import { Request, Response } from 'express';
import Chat from '../model/Chat';
import User from '../model/User';

const create = async (req: Request, res: Response) => {
    

    const { idUserOpening, idUserReceiver } = req.body;
    console.log("idUserOpening " + idUserOpening);
    console.log("idUserReceiver" + idUserReceiver);
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

const getall = async (req: Request, res: Response) => {
    const chats = await Chat.find().populate('client1').populate('client2');
    res.json(chats);
};
const getAllChatsOfUser = async (req: Request, res: Response) => {
    const idUser = req.params.id_user;
    const chats = await Chat.find({ $or: [{ client1: idUser }, { client2: idUser }] }).populate('client1').populate('client2');
    res.json(chats);
};

const getChatByUsers = async (req: Request, res: Response) => {
    const idUserOpening = req.params.id_user_opening;
    const idUserReceiver = req.params.id_user_receiver;

    const chat = await Chat.find({ $or: [{ client1: idUserOpening, client2: idUserReceiver }, { client1: idUserReceiver, client2: idUserOpening }] }).populate('client1').populate('client2');
    res.json(chat);
};
    

const getone = async (req: Request, res: Response) => {
    const chat = await Chat.findById(req.params.id).populate('client1').populate('client2');
    if (!chat) {
        return res.status(404).send('The chat does not exist');
    }
    res.json(chat);
};

export default { create, getall, getone, getAllChatsOfUser, getChatByUsers };