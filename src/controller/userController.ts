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
	const date = req.body.date;
	const imageUrl = "https://res.cloudinary.com/dagbarc6g/image/upload/v1688493081/kw48z7alx733ki2jktbz.jpg";
	const backgroundImageUrl = "https://res.cloudinary.com/dagbarc6g/image/upload/v1688493081/ddb80blvyuof9ichn6ia.jpg";
	const about = "Hello!"
	let password2 = req.body.password;
	const password = await bcrypt.hash(password2, 10);

	const findIfUsernameExists = await User.findOne({
		username: username,
		_id: { $ne: req.params.id } // Exclude the current user's document
	});

	if (findIfUsernameExists) {
		return res.status(402).send('Username already exists.');
	}

	const findIfEmailExists = await User.findOne({
		email: email,
		_id: { $ne: req.params.id } // Exclude the current user's document
	});

	if (findIfEmailExists) {
		return res.status(403).send('Email already exists.');
	}

	const newUser = new User({ name, username, email, password, birthdate, isAdmin: false, imageUrl, backgroundImageUrl, about, date });
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
	const user = await User.findById(req.params.id).populate('meetingsFollowed').populate('blogsLiked').populate('followers').populate('following');
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
		//const isAdmin = req.body.isAdmin;
		const imageUrl = req.body.imageUrl;
		const backgroundImageUrl = req.body.backgroundImageUrl;
		const about = req.body.about;
		const date = req.body.date;

		let newPassword = req.body.repeatPassword;


		console.log("newPassword " + req.body.repeatPassword);
		console.log("imageUrl " + imageUrl);
		console.log("backgroundImageUrl " + backgroundImageUrl);
		console.log("about " + about);
		console.log("name " + name);
		console.log("username " + username);
		console.log("email " + email);
		console.log("req.body.password " + req.body.password);
		console.log("date " + date);



		let updateData: {
			name: any;
			username: any;
			email: any;
			date: any;
			//isAdmin: any;
			imageUrl: any;
			backgroundImageUrl: any;
			password?: any; // Make the password field optional
			about: any;
		} = {
			name,
			username,
			email,
			date,
			//isAdmin,
			imageUrl,
			backgroundImageUrl,
			about,
		};
		console.log("updateData.name " + updateData.name);
		console.log("updateData.username " + updateData.username);
		console.log("updateData.email " + updateData.email);
		console.log("updateData.imageUrl " + updateData.imageUrl);
		console.log("updateData.backgroundImageUrl " + updateData.backgroundImageUrl);
		console.log("updateData.about " + updateData.about);
		console.log("updateData.date " + updateData.date);
		console.log("req.params.id " + req.params.id);
		if (imageUrl == " " || imageUrl == "") {
			console.log("imageUrl is undefined");
			const user = await User.findById(req.params.id);
			if (!user) {
				return res.status(404).send('No user found.');
			}
			const userimageUrl = user.imageUrl;
			updateData.imageUrl = userimageUrl;
		}
		if (backgroundImageUrl == " " || backgroundImageUrl == "") {
			console.log("backgroundImageUrl is undefined");
			const user = await User.findById(req.params.id);
			if (!user) {
				return res.status(404).send('No user found.');
			}
			const userbackgroundImageUrl = user.backgroundImageUrl;
			updateData.backgroundImageUrl = userbackgroundImageUrl;
		}
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


		const findIfUsernameExists = await User.findOne({
			username: username,
			_id: { $ne: req.params.id } // Exclude the current user's document
		});

		if (findIfUsernameExists) {
			return res.status(402).send('Username already exists.');
		}

		console.log("updateData.imageUrl " + updateData.imageUrl);
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

const followUser = async (req: Request, res: Response) => {
	const user = await User.findById(req.params.idUser);
	if (!user) {
		return res.status(404).send('The user does not exist');
	}
	const userToFollow = await User.findById(req.params.idFollowed);
	if (!userToFollow) {
		return res.status(404).send('The user to follow does not exist');
	}
	if (user.following.includes(userToFollow?._id!)) {
		return res.status(404).send('The user is already following this user');
	}

	user.updateOne({ $push: { following: userToFollow._id } }, (err: any) => {
		if (err) {
			return res.status(500).send(err);
		}
		console.log("user saved");
		user.save();

	});
	userToFollow.updateOne({ $push: { followers: user._id } }, (err: any) => {
		if (err) {
			return res.status(500).send(err);
		}
		console.log("user saved");
		userToFollow.save();
		res.status(200).json({ status: 'User saved' });
	});
}

const unfollowUser = async (req: Request, res: Response) => {
	console.log("unfollowUser");
	try {
		const user = await User.findById(req.params.idUser);
		if (!user) {
			return res.status(404).send('The user does not exist');
		}
		const userToUnfollow = await User.findById(req.params.idFollowed);
		if (!userToUnfollow) {
			return res.status(404).send('The user to unfollow does not exist');
		}
		if (!user.following.includes(userToUnfollow?._id!)) {
			return res.status(404).send('The user is not following this user');
		}
		user.updateOne({ $pull: { following: userToUnfollow._id } }, (err: any) => {
			if (err) {
				return res.status(500).send(err);
			}
			console.log("user saved");
			user.save();
		});
		userToUnfollow.updateOne({ $pull: { followers: user._id } }, (err: any) => {
			if (err) {
				return res.status(500).send(err);
			}
			console.log("user saved");
			userToUnfollow.save();
			res.status(200).json({ status: 'User deleted' });
		});
	}
	catch (error) {
		res.status(500).json({ message: 'User not found', error });
	}
}


const updateUserOnlineStatus = async (userId: string, onlineStatus: boolean) => {
	try {
	  const updatedUser = await User.findByIdAndUpdate(
		userId,
		{ online: onlineStatus },
		{ new: true }
	  );
	  return updatedUser;
	} catch (error) {
	  console.error(`Error updating user online status: ${error}`);
	  throw error;
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
	followUser,
	unfollowUser,
	updateUserOnlineStatus
};