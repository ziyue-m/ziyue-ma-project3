const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        user = new User({
            username,
            password
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login User
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    user: {
                        id: user.id,
                        username: user.username,
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getCurrentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'user not verified' });
      }
    res.json({
      id: req.user.id,
      username: req.user.username,
    });
};

exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
