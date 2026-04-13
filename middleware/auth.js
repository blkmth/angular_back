const jwt = require('jsonwebtoken');

// ce middlewar verifei que la requete contient un jwt valide 

exports.verifyToken = (req, res, next) => {

    //le token est envoyé dans l'entete : AUthorisation :bearer <token>

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token missing or invalid' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attache les infos du token a la requete
        next(); // passe  au prochain middleware ou a la route suivante 
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid token or expired' });
    }

};

// middleware pour verifier si l'utilisateur est admin 

exports.isAdmin = (req, res, next) => {
    exports.verifyToken(req, res, () => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }
    });
};


