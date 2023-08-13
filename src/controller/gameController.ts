import Game from '../model/Game';
import Meeting from '../model/Meeting';
import User from '../model/User';
import { Request, Response } from 'express';

// Function to get all games with populated tournament and player data
const getall = async (req: Request, res: Response) => {
    const games = await Game.find().populate('tournament').populate('player');
    res.json(games);
}

// Function to get a specific game by ID
const getone = async (req: Request, res: Response) => {
    const game = await Game.findById(req.params.id_game);
    if (!game) {
        return res.status(404).send('The game does not exist');
    }
    res.json(game).status(200);
}

// Function to add a game with validation for participants
const addGame = async (req: Request, res: Response) => {
    const meeting = await Meeting.findById(req.body[0].tournament).populate('organizer').populate('participants');
    const participants = meeting!.participants;
    const jsonParticipants = JSON.stringify(participants);
    const jsonParticipants2 = JSON.parse(jsonParticipants);

    var json = req.body;
    var keyCount = Object.keys(json).length;

    var nonParticipantUsers = []; // Array to store non-participant usernames

    for (var i = 0; i < keyCount; i++) {
        if (!req.body[i]) {
            break;
        }
        // Check if the player is a participant
        var isParticipant = false;
        for (var j = 0; j < participants.length; j++) {
            if (req.body[i].player === jsonParticipants2[j].username) {
                isParticipant = true;
                break;
            }
        }

        if (!isParticipant) {
            console.log("Player is not a participant");
            nonParticipantUsers.push(req.body[i].player); // Add the non-participant username to the array
            continue; // Skip to the next iteration
        }


        if (req.body[i].tournament == null || req.body[i].player == null) {
            return res.status(500).json({ message: 'Game not found' });
        }
        if (req.body[i].alliance == null) {
            req.body[i].alliance = "---";
        }
        if (req.body[i].victory_points_against === "" || Number.isInteger(parseInt(req.body[i].victory_points_against)) === false) {
            console.log("entro a victory_points_against");
            req.body[i].victory_points_against = 0;
        }
        if (req.body[i].victory_points_favour === "" || Number.isInteger(parseInt(req.body[i].victory_points_favour)) === false) {
            console.log("entro a victory_points_favour");
            req.body[i].victory_points_favour = 0;
        }
        if (req.body[i].leaders_eliminated === "" || Number.isInteger(parseInt(req.body[i].leaders_eliminated)) === false) {
            console.log("entro a leaders_eliminated");
            req.body[i].leaders_eliminated = 0;
        }
        if (req.body[i].games_played === "" || Number.isInteger(parseInt(req.body[i].games_played)) === false) {
            console.log("entro a games_played");
            req.body[i].games_played = 0;
        }
        if (req.body[i].difference_points === "" || Number.isInteger(parseInt(req.body[i].difference_points)) === false) {
            console.log("entro a difference_points");
            req.body[i].difference_points = 0;
        }
        const tournament = req.body[i].tournament;
        const playerusername = req.body[i].player;
        const id_player = await User.findOne({ username: playerusername });
        const player = id_player?.id;
        const alliance = req.body[i].alliance;
        const difference_points = req.body[i].difference_points;
        const victory_points_against = req.body[i].victory_points_against;
        const victory_points_favour = req.body[i].victory_points_favour;
        const leaders_eliminated = req.body[i].leaders_eliminated;
        const games_played = req.body[i].games_played;

        const newGame = new Game({ tournament, player, alliance, difference_points, victory_points_against, victory_points_favour, leaders_eliminated, games_played });
        await newGame.save();

    }

    if (nonParticipantUsers.length > 0) {
        return res.status(200).json({ status: 'Games saved', nonParticipantUsers });
    } else {
        return res.status(200).json({ status: 'Games saved' });
    }

};


// Function to delete a game by ID
const deleteGame = async (req: Request, res: Response) => {
    try {
        await Game.findByIdAndRemove(req.params.id);
        res.status(200).json({ status: 'Game deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Game not found', error });
    }
}

// Function to get games by tournament ID with populated data
const getByTournament = async (req: Request, res: Response) => {
    const game = await Game.find({ tournament: req.params.id_tournament }).populate('tournament').populate('player');
    if (!game) {
        return res.status(404).send('The game does not exist');
    }
    res.json(game).status(200);
}

// Function to add or update a game by tournament and player
const addGamebyTournament = async (req: Request, res: Response) => {
    var games = await Game.find({ tournament: req.params.id_tournament });
    console.log(games);
    if (!games) {
        console.log("no existe");
        const game = new Game(req.body);
        await game.save((err: any) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).json({ status: 'Game saved' });
        })
    }
    else {
        try {
            const alliance = req.body.alliance;
            const difference_points = req.body.difference_points;
            const victory_points_against = req.body.victory_points_against;
            const victory_points_favour = req.body.victory_points_favour;
            const leaders_eliminated = req.body.leaders_eliminated;
            const games_played = req.body.games_played;
            const player = await User.findById(req.params.id_player);
            const games = await Game.findOneAndUpdate(
                { tournament: req.params.id_tournament, player: req.params.id_player },
                { $set: { "games_played": games_played, "victory_points_favour": victory_points_favour, "victory_points_against": victory_points_against, "difference_points": difference_points, "leaders_eliminated": leaders_eliminated } },
            );
            res.json(games).status(200);
        } catch (error) {
            res.status(401).send(error);
        }
    }
}

// Function to add a game by tournament ID and player
const addGamebyTournamentID = async (req: Request, res: Response) => {
    const tournament = req.params.id_tournament;
    if (!req.body.player) {
        console.log("no existe");
        return res.status(400).send('Missing URL parameter: player');
    }
    const player = req.body.player;
    const alliance = req.body.alliance;
    const difference_points = req.body.difference_points;
    const victory_points_against = req.body.victory_points_against;
    const victory_points_favour = req.body.victory_points_favour;
    const leaders_eliminated = req.body.leaders_eliminated;
    const games_played = req.body.games_played;
    const game = new Game({ tournament, player, alliance, difference_points, victory_points_against, victory_points_favour, leaders_eliminated, games_played });
    await game.save((err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Game saved' });
    });
}

// Function to delete games by tournament ID
const deleteGameByTournament = async (req: Request, res: Response) => {
    try {
        await Game.deleteMany({ tournament: req.params.id_tournament });
        res.status(200).json({ status: 'Game deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Game not found', error });
    }
}

// Function to delete a specific game by ID
const deleteRowByTournamentID = async (req: Request, res: Response) => {
    try {
        await Game.deleteOne({ _id: req.params._id });
        res.status(200).json({ status: 'Game deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Game not found', error });
    }
}


export default {
    getall,
    getone,
    deleteGame,
    addGame,
    getByTournament,
    addGamebyTournament,
    addGamebyTournamentID,
    deleteGameByTournament,
    deleteRowByTournamentID
}