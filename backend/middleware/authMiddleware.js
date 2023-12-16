const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    console.log("Received token:", token); 

    try {
        const extractedToken = token.split(' ')[1];
        const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
        console.log("Decoded user from token:", decoded.user);
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error("Token verification error:", err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
