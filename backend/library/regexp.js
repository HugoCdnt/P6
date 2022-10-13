// Validation des données lors de l'inscription d'un utilisateur

const Sauce = require('../models/Sauce');

exports.email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
exports.password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const formRegExp = /^(.|\s)*\S(.|\s)*$/;
// exports.sauceForm = /^(.|\s)*\S(.|\s)*$/;

// exports.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
// exports.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

exports.sauceValidation = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log(sauce);
            if (formRegExp.test(req.body.name) && formRegExp.test(req.body.manufacturer) && formRegExp.test(req.body.description) && formRegExp.test(req.body.mainPepper)) {
                console.log("ça marche !");
                next();
            } else {
                res.status(401).json({ message: 'Merci de remplir tous les champs' });
            }
        })
};