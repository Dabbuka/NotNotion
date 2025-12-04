import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET || 'fallbackSecret', { expiresIn: '30d',});
}

/**
 * @route POST /users/register
 * @desc Register a new user
 */
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        //Check if the user filled out all fields
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields"});
        }

        //Check if user already exists
        const isUser = await User.findOne({ email });
        if (isUser) {
            return res.status(400).json({ message: "User already exists"});
        }

        //Hashes the user's password before adding it to Mongo
        const saltRounds = 12;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if (user) {
            return res.status(201).json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Invalid user data"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error"});
    }
};

/**
 * @route POST /users/login
 * @desc Authenticate and login an existing user
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Check if the user filled all fields
        if (!email || !password) {
            res.status(400).json({ message: "Please fill all fields"});
        }

        const user = await User.findOne( { email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: "Incorrect username or password"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Server error"});
    }
};

/**
 * @route /users/me
 * @desc Retrieve user data
 */
export const retrieveUser = async (req, res) => {
    res.status(200).json({ message: "User data display"});
};