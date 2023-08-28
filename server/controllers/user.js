const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Register a new user
module.exports.register = async (req, res) => {
    const { username, mail, password } = req.body;

    try {
        // Check if the user with the given email already exists
        const user = await User.findOne({ mail: mail });

        if (user) {
            // User already exists
            res.send({ success: false, err: 1 });
        } else {
            // Hash the password and create a new user
            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    // Error occurred while hashing
                    res.send(err);
                } else {
                    // Create a new user with hashed password
                    const newUser = new User({
                        username: username,
                        mail: mail,
                        passHash: hash
                    });

                    await newUser.save();
                    res.send({ success: true });
                }
            });
        }
    } catch (err) {
        // Error occurred during registration process
        res.send({ success: false, err: 0 });
    }
}

// Login user
module.exports.login = async (req, res) => {
    
    try {
        const { mail, password } = req.body;

        // Find user by email
        const user = await User.findOne({ mail: mail });

        if (user && bcrypt.compareSync(password, user.passHash)) {
            // Password matches, create JWT token
            const token = jwt.sign({ ...user }, process.env.JWT_SECRET_KEY, { expiresIn: '20d' });
            res.send({ success: true, token, data: { username: user.name, mail: mail } });
        } else {
            // Invalid email or password
            res.send({ success: false, err: 1 });
        }
    } catch (err) {
        // Error occurred during login process
        res.send({ success: false, err: 0 });
    }
}

// Get list of usernames
module.exports.getUsers = async (req, res) => {
    try {
        // Fetch all users
        const users = await User.find({});
        const usernames = users.map(({ username }) => username);
        res.send(usernames);
    } catch (error) {
        // Error occurred while fetching users
        res.status(500).send('An error occurred while fetching users.');
    }
}
