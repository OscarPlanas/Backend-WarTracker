import express from "express";
import fileUpload from "express-fileupload";
import bodyParser from "body-parser";
import mongoose, { ConnectOptions } from "mongoose";
import cors from "cors";
import User from "./api/User";
import Blog from "./api/blog";
import Report from "./api/Report";
import auth from "./api/auth";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import http from 'http';

const app = express();




const port = process.env.PORT || 5432;
/** Server Handling */


app.use(express.static('src/upload/'))
app.use(fileUpload());
app.use(bodyParser.urlencoded({ extended : true }));
app.use(bodyParser.json())
app.use(cors());

app.use('/api/users', User)
app.use('/api/blogs', Blog)
app.use('/api/auth', auth)
app.use('/api/report', Report)


app.get('/', ( req: express.Request, res: express.Response ) => {
	res.send('Hello World!')
})


//mongo
mongoose.connect('mongodb://localhost/WarTracker', { useNewUrlParser : true } as ConnectOptions)
	.then(() => {
		// tslint:disable-next-line:no-console
        app.listen(port, () => console.log('Server corriendo en el puerto ' + port));
	})
	.catch((err) => {
		// tslint:disable-next-line:no-console
		console.log(err);
	});
