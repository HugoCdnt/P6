// Validation des données lors de l'inscription d'un utilisateur

const regExpEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const regExpPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

module.exports = (req, res, next) => {
    if ((regExpEmail.test(req.body.email)) && (regExpPassword.test(req.body.password))) {
        console.log("Tutto bene");
        next();
    } else {
        res.status(401).json({ message: 'Merci de renseigner un email & un mot de passe correct' });
    }
};