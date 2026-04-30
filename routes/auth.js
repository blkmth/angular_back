const User = require('../model/user');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//  register (enregistrer) creation de compte 
exports.register = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // verifier si l'utilisateur existe deja 
        const exitingUser = await User.findOne({ username });
        if (exitingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // hasher le mot de passe 10 = nombres de rounds 
        const hashedPassword = await bcrypt.hash(password, 10);

        // creer le nouvel utilisateur 
        const user = new User({ username, password: hashedPassword, role: role || 'user' });
        await user.save();

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error creating user' });
    }

};

// Login (connexion auth) : se connecter et obtenir des tokens jwt

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // verifier si l'utilisateur existe deja 
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // comparer le mot de passe 
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // generer un token valide 24h
        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },

            process.env.JWT_SECRET, // clé secrete dans .env
            { expiresIn: '24h' } //expire en 24h
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error logging in' });
    }
}

// logout: endpoint simple à appeler côté front pour clore la session client
exports.logout = async (req, res) => {
    // Si vous utilisez des cookies, ici on pourrait clearCookie
    // Avec JWT en localStorage, le frontend supprime simplement le token.
    res.status(200).json({ message: 'Logged out' });
}