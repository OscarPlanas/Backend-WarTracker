import Game from '../model/Game';
import User from '../model/User';

import { Request, Response } from 'express';
const getall = async (req: Request, res: Response) => {
    const games = await Game.find();
    //.populate('tournament').populate('player')
    res.json(games);
}
const getone = async (req: Request, res: Response) => {
    const game = await Game.findById(req.params.id_game).populate('meeting').populate({
        path: 'comments',
        populate: { path: 'competitor' }
    });
    if (!game) {
        return res.status(404).send('The game does not exist');
    }
    res.json(game);
}

const addGame = async (req: Request, res: Response) => {
    const game = new Game(req.body);
    await game.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Game saved' });
    });
};

const update = async (req: Request, res: Response) => {
   /* try{
        const title = req.body.title;
        const description = req.body.description;
        const blog = await Blog.findByIdAndUpdate(req.params.id, {
            title, description
        }, {new: true});
        res.json(blog).status(200);
    }catch (error) {
        res.status(401).send(error);
    }*/
}

const deleteGame = async (req: Request, res: Response) => {
    try {
        await Game.findByIdAndRemove(req.params.id);
        res.status(200).json({ status: 'Game deleted' });
    }
    catch (error) {
        res.status(500).json({message: 'Game not found', error });
    }
}

export default {
    getall,
    getone,
    update,
    deleteGame,
    addGame,
}