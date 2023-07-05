import User from '../model/User';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import IJwtPayload from '../model/IJwtPayload';
import bcrypt from 'bcrypt';

const secretoJWT: string = 'NuestraClaveEA3';


const register = async (req: Request, res: Response) => {
	const name = req.body.name;
	const username = req.body.username;
	const birthdate = req.body.birthdate;
	const email = req.body.email;
	const imageUrl = "https://res.cloudinary.com/dagbarc6g/image/upload/v1688493081/kw48z7alx733ki2jktbz.jpg";
	const backgroundImageUrl = "https://res.cloudinary.com/dagbarc6g/image/upload/v1688493081/ddb80blvyuof9ichn6ia.jpg";
	const about = "Hello!"
	let password2 = req.body.password;
	const password = await bcrypt.hash(password2, 10);

	const newUser = new User({ name, username, email, password, birthdate, isAdmin: false, imageUrl, backgroundImageUrl, about });
	await newUser.save((err: any) => {
		if (err) {
			return res.status(500).send(err);
		}
	});

	const session = { id: username } as IJwtPayload;

	const token = jwt.sign({ id: newUser._id }, secretoJWT, {
		expiresIn: 60 * 60 * 24
	});
	res.json({ auth: true, token, id: newUser._id, session });
};

const profile = async (req: Request, res: Response) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return res.status(404).send('No user found.');
	}

	res.status(200).json(user);
};
const getall = async (req: Request, res: Response) => {
	const users = await User.find();
	res.status(200).json(users);
};

const getone = async (req: Request, res: Response) => {
	const user = await User.findById(req.params.id);
	if (!user) {
		return res.status(404).send('No user found.');
	}
	res.status(200).json(user);
};

const getbyemail = async (req: Request, res: Response) => {
	const user = await User.findOne({ email: req.params.email });
	res.json(user);
};

const deleteUser = async (req: Request, res: Response) => {
	try {
		await User.findByIdAndRemove(req.params.id);
		res.status(200).json({ status: 'User deleted' });
	}
	catch (error) {
		res.status(500).json({ message: 'error unknown', error });
	}
};

const update = async (req: Request, res: Response) => {
	try {
	  const name = req.body.name;
	  const username = req.body.username;
	  const email = req.body.email;
	  const isAdmin = req.body.isAdmin;
	  const imageUrl = req.body.imageUrl;
	  const backgroundImageUrl = req.body.backgroundImageUrl;
	  const about = req.body.about;
  
	  let newPassword = req.body.repeatPassword;
  
	  console.log(req.body.password);
	  console.log(req.body.repeatPassword);
	  let updateData: {
		name: any;
		username: any;
		email: any;
		isAdmin: any;
		imageUrl: any;
		backgroundImageUrl: any;
		password?: any; // Make the password field optional
		about: any;
	  } = {
		name,
		username,
		email,
		isAdmin,
		imageUrl,
		backgroundImageUrl,
		about,
	  };
  
	  if (newPassword) {
		const checkUserPass = await User.findOne({ email: email });
		if (!checkUserPass) {
		  return res.status(404).send('No user found.');
		}
		const userPass = checkUserPass.password;
		console.log(userPass);
  
		// Compare the entered plain text password with the stored hashed password
		const passwordMatches = await bcrypt.compare(req.body.password, userPass!);
		console.log(passwordMatches);
		if (!passwordMatches) {
		  console.log("Password incorrect.");
		  return res.status(401).send('Password incorrect.');
		}
  
		const hashedNewPassword = await bcrypt.hash(newPassword, 10);
		updateData.password = hashedNewPassword;
	  }

	  const findIfUsernameExists = await User.findOne({ username: username });
	  if (findIfUsernameExists) {
		return res.status(402).send('Username already exists.');
	  }
  
	  const user = await User.findByIdAndUpdate(
		req.params.id,
		updateData,
		{ new: true }
	  );
  
	  res.json(user).status(200);
	} catch (error) {
	  res.status(401).send(error);
	}
  };
  
  

export default {
	register,
	profile,
	getall,
	getone,
	deleteUser,
	update,
	getbyemail,
};