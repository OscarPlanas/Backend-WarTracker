import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import http from 'http';
import mongoose, { ConnectOptions } from "mongoose";
import { Server, Socket } from "socket.io";
import Chat from "./api/Chat";
import Game from "./api/Game";
import Meeting from "./api/Meeting";
import Message from "./api/Message";
import Report from "./api/Report";
import User from "./api/User";
import auth from "./api/auth";
import Blog from "./api/blog";
import Comment from "./api/Comment";
import Event from "./api/Event";

import userController from "./controller/userController";

const app = express();
const port = process.env.PORT || 5432;
const server = http.createServer(app);
const io = new Server(server);

/** Server Handling */
app.use(express.static('src/upload/'))
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());

app.use('/api/users', User)
app.use('/api/blogs', Blog)
app.use('/api/auth', auth)
app.use('/api/meetings', Meeting)
app.use('/api/games', Game)
app.use('/api/report', Report)
app.use('/api/chats', Chat)
app.use('/api/messages', Message)
app.use('/api/comments', Comment)
app.use('/api/events', Event)


app.get('/', (req: express.Request, res: express.Response) => {
	res.send('Hello World!')
});

//mongo
mongoose.connect('mongodb://localhost/WarTracker', { useNewUrlParser: true } as ConnectOptions)
	.then(() => {
		server.listen(port, () => console.log('Server corriendo en el puerto ' + port));
	})
	.catch((err) => {
		console.log(err);
	});

// Socket.IO connection handling
const clients: { [key: string]: Socket } = {};

io.on("connection", (socket: Socket) => {
	console.log("connected");
	console.log(socket.id, "has joined");


	socket.on("signin", (id: string) => {
		console.log(id);
		clients[id] = socket;
		try {
			userController.updateUserOnlineStatus(id, true);
			console.log(`User ${id} is now online`);
		} catch (error) {
			console.error(`Error updating online status for user ${id}: ${error}`);
		}
		console.log(clients);
	});

	socket.on("message", (msg: { targetId: string; message: string }) => {
		console.log(msg);
		const targetId = msg.targetId;
		if (clients[targetId]) clients[targetId].emit("message", msg);
	});
	// When a user comes online, emit an event to notify other users
	socket.on('userOnline', (userId) => {
		socket.broadcast.emit('userOnline', userId);
	});

	// When a user goes offline, emit an event to notify other users
	socket.on('userOffline', (userId) => {
		socket.broadcast.emit('userOffline', userId);
	});


	socket.on("disconnect", () => {
		console.log(socket.id, "has left");
		for (const key in clients) {
			if (clients[key].id === socket.id) {
				delete clients[key];
				// Update user's online status in the database
				try {
					userController.updateUserOnlineStatus(key, false);
					console.log(`User ${key} is now offline`);
				} catch (error) {
					console.error(`Error updating online status for user ${key}: ${error}`);
				}

				break;
			}
		}
		console.log(clients);
	});
});
