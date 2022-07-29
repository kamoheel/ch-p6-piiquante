const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
     try {
        //le token pour l'instant inclut "Bearer token", on veut récupérer après l'espace ' ', le token qui est en 2eme [1]
        const token = req.headers.authorization.split(' ')[1];
        //décoder le token
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
     } catch(error) {
        res.status(401).json({ error });
     };
};