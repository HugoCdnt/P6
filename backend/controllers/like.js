const Sauce = require('../models/Sauce');

exports.likeSauce = (req, res, next) => {
    if (req.auth.userId != req.body.userId) {
        res.status(400).json({ message: 'Veuillez donner les informations propres au like' });
    } else {
        // Chercher la Sauce dans la BDD
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                console.log("--> Contenu résultat promise : sauce");
                console.log(sauce);

                if (req.body.like === 1) {
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        res.status(400).json({ message: "Merci d'enlever votre dislike avant de liker cette sauce" });
                    } else if (!sauce.usersLiked.includes(req.body.userId)) {
                        console.log("userId non présent dans le tableau des likes");

                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: 1 },
                                $push: { usersLiked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Sauce likée !" }))
                            .catch((error) => res.status(400).json({ error }));
                    } else {
                        res.status(400).json({ message: "Vous avez déjà liké cette sauce !" })
                    }
                }

                else if (req.body.like === 0) {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        console.log("userId présent dans le tableau des likes");
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { likes: -1 },
                                $pull: { usersLiked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Sauce neutre !" }))
                            .catch((error) => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        console.log("userId présent dans le tableau des dislikes");
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: -1 },
                                $pull: { usersDisliked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Sauce neutre !" }))
                            .catch((error) => res.status(400).json({ error }));
                    } else {
                        res.status(400).json({ message: "Vous n'avez pas encore liké ou disliké la sauce" })
                    }
                }

                else if (req.body.like === -1) {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        res.status(400).json({ message: "Merci d'enlever votre like avant de disliker cette sauce" });
                    } else if (!sauce.usersDisliked.includes(req.body.userId)) {
                        console.log("userId non présent dans le tableau des dislikes");
                        Sauce.updateOne(
                            { _id: req.params.id },
                            {
                                $inc: { dislikes: 1 },
                                $push: { usersDisliked: req.body.userId }
                            }
                        )
                            .then(() => res.status(201).json({ message: "Sauce dislikée !" }))
                            .catch((error) => res.status(400).json({ error }));
                    } else {
                        res.status(400).json({ message: "Vous avez déjà disliké cette sauce !" })
                    }
                }
            })
            .catch((error) => res.status(404).json({ error }));
    }
};



///////////////////////////////







// exports.likeSauce = (req, res, next) => {
//     // Affichage req.body
//     console.log("--> Contenu req.auth.userId - cntl like");
//     console.log(req.auth.userId);

//     // récupérer l'Id dans l'url de la requête 
//     console.log("--> Contenu de req Params");
//     console.log(req.params);

//     // Mise au format de l'ID de la sauce pour trouver celle correspondante dans la BDD
//     console.log({ _id: req.params.id });

//     // Chercher la Sauce dans la BDD
//     Sauce.findOne({ _id: req.params.id })
//         .then((sauce) => {
//             // si le userliked est false ET SI like === 1 
//             if (!sauce.usersLiked.includes(req.auth.userId) && req.body.like === 1) {
//                 console.log("userId présent dans le tableau des likes");

//                 // mise à jour sauce BDD 
//                 Sauce.updateOne(
//                     { _id: req.params.id },
//                     {
//                         $inc: { likes: 1 },
//                         $push: { usersLiked: req.auth.userId }
//                     }
//                 )
//                     .then(() => res.status(201).json({ message: "Sauce likée !" }))
//                     .catch((error) => res.status(400).json({ error }));
//             }
//             // si le userId est dans le tableau des likes ET SI like === 0 
//             else if (sauce.usersLiked.includes(req.auth.userId) && req.body.like === 0) {
//                 console.log("userId présent dans le tableau des likes");
//                 Sauce.updateOne(
//                     { _id: req.params.id },
//                     {
//                         $inc: { likes: -1 },
//                         $pull: { usersLiked: req.auth.userId }
//                     }
//                 )
//                     .then(() => res.status(201).json({ message: "Sauce délikée !" }))
//                     .catch((error) => res.status(400).json({ error }));

//             } else if (!sauce.usersDisliked.includes(req.auth.userId) && req.body.like === -1) {
//                 console.log("userId non présent dans le tableau des dislikes");
//                 Sauce.updateOne(
//                     { _id: req.params.id },
//                     {
//                         $inc: { dislikes: 1 },
//                         $push: { usersDisliked: req.auth.userId }
//                     }
//                 )
//                     .then(() => res.status(201).json({ message: "Sauce dislikée !" }))
//                     .catch((error) => res.status(400).json({ error }));

//             } else if (sauce.usersDisliked.includes(req.auth.userId) && req.body.like === 0) {
//                 console.log("userId présent dans le tableau des likes");
//                 Sauce.updateOne(
//                     { _id: req.params.id },
//                     {
//                         $inc: { dislikes: -1 },
//                         $pull: { usersDisliked: req.auth.userId }
//                     }
//                 )
//                     .then(() => res.status(201).json({ message: "Sauce neutre !" }))
//                     .catch((error) => res.status(400).json({ error }));

//             } else {
//                 console.log("false");
//             }
//         })
//         .catch((error) => res.status(404).json({ error }));
// }



//     // Dans le front, passage d'un like à un dislike sans annuler son vote précédent
                    // } else if (sauce.usersLiked.includes(req.body.userId) && req.body.like === -1) {
                    //     console.log("userId présent dans le tableau des likes");
                    //     Sauce.updateOne(
                    //         { _id: req.params.id },
                    //         {
                    //             $inc: { dislikes: 1, likes: -1 },
                    //             $pull: { usersLiked: req.body.userId },
                    //             $push: { usersDisliked: req.body.userId }
                    //         }
                    //     )
                    //         .then(() => res.status(201).json({ message: "Sauce dislikée !" }))
                    //         .catch((error) => res.status(400).json({ error }));

                    // } else if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 1) {
                    //     console.log("userId présent dans le tableau des dislikes");
                    //     Sauce.updateOne(
                    //         { _id: req.params.id },
                    //         {
                    //             $inc: { likes: 1, dislikes: -1 },
                    //             $pull: { usersDisliked: req.body.userId },
                    //             $push: { usersLiked: req.body.userId }
                    //         }
                    //     )
                    //         .then(() => res.status(201).json({ message: "Sauce likée !" }))
                    //         .catch((error) => res.status(400).json({ error }));