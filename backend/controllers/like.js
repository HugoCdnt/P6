const Sauce = require('../models/Sauce');

// Pour le like d'une sauce, 2 éléments à prendre en compte : l'id de la sauce, l'id de l'utilisateur

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            console.log("SAUCE : " + sauce);
            console.log("User ID : " + sauce.userId);
            console.log("USER ID de Auth : " + req.auth.userId);
            console.log("Likes : " + sauce.usersLiked);

            sauce.likes++;

            // sauce.usersLiked.findOne({ userId: sauce.usersLiked })
            //     .then(console.log("trouvé !"));


            // ({ _id: req.params.id })
            // .then((sauce) => {
            //     if (sauce.userId != req.auth.userId) {
            //         res.status(401).json({ message: 'Non autorisé' });
            //     } else {
            //         Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            //             .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
            //             .catch(error => res.status(401).json({ error }));
            //     }

            // sauce.usersLiked += sauce.userId;
            // sauce.save()
            //     .then(() => res.status(200).json({ message: 'Sauce likée !' }))
            //     .catch(error => res.status(401).json({ error }));

        })
        .catch(error => res.status(400).json({ error }))
};