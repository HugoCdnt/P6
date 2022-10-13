const Sauce = require('../models/Sauce');

// Pour le like d'une sauce, 2 éléments à prendre en compte : l'id de la sauce, l'id de l'utilisateur

exports.likeSauce = (req, res, next) => {
    // Affichage req.body
    console.log("--> Contenu req body - cntl like");
    console.log(req.body);

    // récupérer l'Id dans l'url de la requête 
    console.log("--> Contenu de req Params");
    console.log(req.params);

    // Mise au format de l'ID de la sauce pour trouver celle correspondante dans la BDD
    console.log({ _id: req.params.id });

    // Chercher la Sauce dans la BDD
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log("--> Contenu résultat promise : sauce");
            console.log(sauce);
            // utilisation de la méthode js includes()
            // utilisation de l'opérateur $inc (mongoDB)
            // utilisation de l'opérateur $push (mongoDB)
            // utilisation de l'opérateur $pull (mongoDB)

            // si le userliked est false ET SI like === 1 
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                console.log("userId présent dans le tableau des likes");

                // mise à jour sauce BDD 
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: 1 },
                        $push: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Sauce likée !" }))
                    .catch((error) => res.status(400).json({ error }));
            }
            // si le userId est dans le tableau des likes ET SI like === 0 
            else if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                console.log("userId présent dans le tableau des likes");
                Sauce.updateOne(
                    { _id: req.params.id },
                    {
                        $inc: { likes: -1 },
                        $pull: { usersLiked: req.body.userId }
                    }
                )
                    .then(() => res.status(201).json({ message: "Sauce délikée !" }))
                    .catch((error) => res.status(400).json({ error }));

            } else {
                console.log("false");
            }
        })
        .catch((error) => res.status(404).json({ error }));

    // like = 1 (likes = +1)


    // like = 0 (likes = 0, neutre)


    // like = -1 (dislikes = +1)

    // like = 0 (dislikes = 0)
}


// exports.likeSauce = (req, res, next) => {
//     Sauce.findOne({ _id: req.params.id })
//         .then(sauce => {
//             console.log("SAUCE : " + sauce);
//             console.log("User ID : " + sauce.userId);
//             console.log("USER ID de Auth : " + req.auth.userId);
//             console.log("Likes : " + sauce.usersLiked);

//             sauce.likes++;

//             // sauce.usersLiked.findOne({ userId: sauce.usersLiked })
//             //     .then(console.log("trouvé !"));


//             // ({ _id: req.params.id })
//             // .then((sauce) => {
//             //     if (sauce.userId != req.auth.userId) {
//             //         res.status(401).json({ message: 'Non autorisé' });
//             //     } else {
//             //         Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
//             //             .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
//             //             .catch(error => res.status(401).json({ error }));
//             //     }

//             // sauce.usersLiked += sauce.userId;
//             // sauce.save()
//             //     .then(() => res.status(200).json({ message: 'Sauce likée !' }))
//             //     .catch(error => res.status(401).json({ error }));

//         })
//         .catch(error => res.status(400).json({ error }))
// };