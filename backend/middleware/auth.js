const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        console.log("---> Middleware authentification");
        console.log(req.headers.authorization);

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, `${process.env.SECRET_TOKEN}`);
        const userIdDecodedToken = decodedToken.userId;
        // console.log("--> User Id dans le body de la request");
        // console.log(req.body);
        req.auth = {
            userId: userIdDecodedToken
        };
    } catch (error) {
        res.status(401).json({ error });
    }
};