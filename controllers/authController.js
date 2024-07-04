const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                statusCode: 400, message: "User already exists"
            });
        }

        const user = await User.create({ username, email, password });

        res.status(201).json({
            statusCode: 201,
            message: "User created successfully",
            data: {
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            }
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500, message: "Server error"
        });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                statusCode: 200,
                message: "Logged in successfully",
                data: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    token: generateToken(user._id),
                }
            });
        } else {
            res.status(401).json({
                statusCode: 401, message: "Invalid email or password"
            });
        }
    } catch (error) {
        res.status(500).json({
            statusCode: 500, message: "Server error"
        });
    }
};
