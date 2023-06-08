import { param } from 'express-validator';
import Game from '../model/Game';
import User from '../model/User';
import Meeting from '../model/Meeting';

import { Request, Response, response } from 'express';
import meetingController from './meetingController';
const getall = async (req: Request, res: Response) => {
    const games = await Game.find().populate('tournament').populate('player');
    res.json(games);
}
const getone = async (req: Request, res: Response) => {
    const game = await Game.findById(req.params.id_game);
    if (!game) {
        return res.status(404).send('The game does not exist');
    }
    res.json(game).status(200);
}

const addGame = async (req: Request, res: Response) => {
    /*const owner = req.params.id;
    const reason = req.body.reason;
    const user_reported = req.body.user_reported;
    const date = req.body.date;
    const newReport = new Report({
        owner,
        user_reported,
        reason,
        date
        
    });
    await newReport.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Report saved' });
    });*/
    console.log("entro a addGame");
    console.log("|");
    /*  const meeting = await Meeting.findById(req.params.id).populate('organizer').populate('participants');
    if (!meeting) {
        return res.status(404).send('The meeting does not exist');
    }
    res*/
    const meeting = await Meeting.findById(req.body[0].tournament).populate('organizer').populate('participants');
    console.log(meeting);
    console.log("PARTICIPANTS");
    const participants = meeting!.participants;
    const jsonParticipants = JSON.stringify(participants);
    console.log(jsonParticipants);
    const jsonParticipants2 = JSON.parse(jsonParticipants);
    console.log(jsonParticipants2);
    console.log(jsonParticipants2[0].username);
    //console.log(jsonParticipants2.username);
    console.log(jsonParticipants2[1].username);
    console.log("separado");
    console.log("^");
    console.log(participants.length);

    /* var json = req.body;
     var keyCount = Object.keys(json).length;
     console.log(keyCount);
     for (var i = 0; i < keyCount; i++) {
         console.log("entro al for");
         console.log(participants[i]);
         console.log(req.body[i].player);
         var found = false;
       
         for (var j = 0; j < participants.length; j++) {
           if (req.body[i].player === jsonParticipants2[j].username) {
             console.log("entro al if");
             console.log(participants[j]);
             console.log(req.body[i].player);
             found = true;
             break; // Exit the inner loop once a match is found
           }
         }
       
         if (!found) {
           console.log("This player is not in the tournament");
           return res.status(500).json({ message: 'The player is not in the tournament' });
         }
       }*/



    console.log(req.body);
    console.log(req.body['tournament'] + "50");
    console.log(req.body[0].tournament + "51");
    console.log(req.body['player'] + "52");
    console.log(req.body['alliance'] + "53");
    console.log(req.body['difference_points'] + "54");
    console.log(req.body.tournament);
    console.log(req.body.player);
    console.log(req.body.alliance);
    console.log(req.body.difference_points);
    console.log("decode");

    var json = req.body;
    var keyCount = Object.keys(json).length;
    console.log(keyCount);

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
        if (req.body[i].victory_points_against === "") {
            console.log("entro a victory_points_against");
            req.body[i].victory_points_against = 0;
        }
        if (req.body[i].victory_points_favour === "") {
            console.log("entro a victory_points_favour");
            req.body[i].victory_points_favour = 0;
        }
        if (req.body[i].leaders_eliminated === "") {
            console.log("entro a leaders_eliminated");
            req.body[i].leaders_eliminated = 0;
        }
        if (req.body[i].games_played === "") {
            console.log("entro a games_played");
            req.body[i].games_played = 0;
        }
        if (req.body[i].difference_points === "") {
            console.log("entro a difference_points");
            req.body[i].difference_points = 0;
        }
        console.log("valores nulos");
        console.log(req.body[i].tournament);
        console.log(req.body[i].player);
        console.log(req.body[i].alliance);
        console.log(req.body[i].difference_points);
        console.log(req.body[i].victory_points_against);
        console.log(req.body[i].victory_points_favour);
        console.log(req.body[i].leaders_eliminated);
        console.log(req.body[i].games_played);
        console.log("valores nulos");


        const tournament = req.body[i].tournament;
        const playerusername = req.body[i].player;
        //const game = await Game.findById(req.params.id_game).populate('meeting').populate({
        const id_player = await User.findOne({ username: playerusername });
        console.log(id_player?.id);
        const player = id_player?.id;
        const alliance = req.body[i].alliance;
        const difference_points = req.body[i].difference_points;
        const victory_points_against = req.body[i].victory_points_against;
        const victory_points_favour = req.body[i].victory_points_favour;
        const leaders_eliminated = req.body[i].leaders_eliminated;
        const games_played = req.body[i].games_played;
        console.log(alliance);

        const newGame = new Game({ tournament, player, alliance, difference_points, victory_points_against, victory_points_favour, leaders_eliminated, games_played });
        console.log(newGame);
        await newGame.save();
        console.log("guardado");

    }

    if (nonParticipantUsers.length > 0) {
        return res.status(200).json({ status: 'Games saved', nonParticipantUsers });
    } else {
        return res.status(200).json({ status: 'Games saved' });
    }

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
        res.status(500).json({ message: 'Game not found', error });
    }
}

const getByTournament = async (req: Request, res: Response) => {
    const game = await Game.find({ tournament: req.params.id_tournament }).populate('tournament').populate('player');
    if (!game) {
        return res.status(404).send('The game does not exist');
    }
    res.json(game).status(200);
}

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
            console.log("try");
            console.log(req.body);
            console.log(req.params.id_player);
            console.log(req.params.id_tournament);
            const alliance = req.body.alliance;
            //const player = req.body.player;
            const difference_points = req.body.difference_points;
            const victory_points_against = req.body.victory_points_against;
            const victory_points_favour = req.body.victory_points_favour;
            const leaders_eliminated = req.body.leaders_eliminated;
            const games_played = req.body.games_played;
            const player = await User.findById(req.params.id_player);
            // db.grades.findOneAndUpdate(
            //     { "name" : "R. Stiles" },
            //     { $inc: { "points" : 5 } }
            //  )
            const games = await Game.findOneAndUpdate(
                { tournament: req.params.id_tournament, player: req.params.id_player },
                { $set: { "games_played": games_played, "victory_points_favour": victory_points_favour, "victory_points_against": victory_points_against, "difference_points": difference_points, "leaders_eliminated": leaders_eliminated } },
            );
            res.json(games).status(200);
        } catch (error) {
            res.status(401).send(error);
        }

        //games.tournament = req.params.tournament;


    }


}

const addGamebyTournamentID = async (req: Request, res: Response) => {
    console.log("try");
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
    console.log(game);
    await game.save((err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Game saved' });
    });
}


/*const game = new Game(req.body);
    await game.save( (err: any) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json({ status: 'Game saved' });
    });
};*/


const deleteGameByTournament = async (req: Request, res: Response) => {
    try {
        await Game.deleteMany({ tournament: req.params.id_tournament });
        res.status(200).json({ status: 'Game deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Game not found', error });
    }
}

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
    update,
    deleteGame,
    addGame,
    getByTournament,
    addGamebyTournament,
    addGamebyTournamentID,
    deleteGameByTournament,
    deleteRowByTournamentID
}