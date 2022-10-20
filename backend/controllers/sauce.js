const Sauce = require('../models/Sauce');
const fs = require('fs');

const formRegExp = /^(.|\s)*\S(.|\s)*$/;

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    sauceObject.dislikes = 0;
    sauceObject.likes = 0;
    // delete sauceObject._id;
    // delete sauceObject._userId;

    if ((formRegExp.test(sauceObject.name)) && (formRegExp.test(sauceObject.manufacturer)) && (formRegExp.test(sauceObject.description)) && (formRegExp.test(sauceObject.mainPepper))) {
        const sauce = new Sauce({
            ...sauceObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        sauce.save()
            .then(() => { res.status(201).json({ message: 'Sauce ajoutée !' }) })
            .catch(error => { res.status(400).json({ error }) })
    } else {
        res.status(422).json({ message: 'Merci de remplir tous les champs' });
    }
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const photoName = sauce.imageUrl.split('/')[4];
                fs.unlink(`images/${photoName}`, (err => {
                    if (err) console.log(err);
                    else {
                        console.log("Deleted file");
                    }
                }))
            })
    }

    delete sauceObject._userId;

    // Sauce.findOne({ _id: req.params.id })
    //     .then((sauce) => {
    //         if (sauce.userId != req.auth.userId) {
    //             res.status(403).json({ message: 'Non autorisé' });
    //         } else {
    //             if ((formRegExp.test(sauceObject.name)) && (formRegExp.test(sauceObject.manufacturer)) && (formRegExp.test(sauceObject.description)) && (formRegExp.test(sauceObject.mainPepper)) && (sauceObject.heat >= 1 && sauceObject.heat <= 10)) {
    //                 Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    //                     .then(() => res.status(200).json({ message: 'Sauce modifiée !' }));
    //             } else {
    //                 res.status(422).json({ message: 'Merci de remplir tous les champs' });
    //             }
    //         }
    //     })
    //     .catch(error => res.status(404).json({ error: "Cette sauce n'existe pas" }))

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non autorisé' });
            } else {
                if ((formRegExp.test(sauceObject.name)) && (formRegExp.test(sauceObject.manufacturer)) && (formRegExp.test(sauceObject.description)) && (formRegExp.test(sauceObject.mainPepper))) {
                    if (sauceObject.heat < 1 || sauceObject.heat > 10) {
                        res.status(401).json({ message: 'La puissance de la sauce doit être comprise entre 1 et 10.' })
                    } else {
                        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                            .then(() => res.status(200).json({ message: 'Sauce modifiée !' }));
                    }
                } else {
                    res.status(422).json({ message: 'Merci de remplir tous les champs' });
                }
            }
        })
        .catch(error => res.status(404).json({ error: "Cette sauce n'existe pas" }))
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'Non autorisé' })
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée' }) })
                        .catch(error => res.status(401).json({ error }));
                })
            }
        })
        .catch(error => {
            res.status(404).json({ error: 'Not found' });
        })
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce === null) {
                return res.status(404).json({ error: "Cette sauce n'existe pas" })
            }
            res.status(200).json(sauce);
        })
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


exports.likeSauce = (req, res, next) => {
    // Chercher la Sauce dans la BDD
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            console.log("--> Contenu résultat promise : sauce");
            console.log(sauce);

            if (req.body.like === 1) {
                if (sauce.usersDisliked.includes(req.auth.userId)) {
                    res.status(400).json({ message: "Merci d'enlever votre dislike avant de liker cette sauce" });
                } else if (!sauce.usersLiked.includes(req.auth.userId)) {
                    console.log("userId non présent dans le tableau des likes");

                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: 1 },
                            $push: { usersLiked: req.auth.userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: "Sauce likée !" }))
                        .catch((error) => res.status(400).json({ error }));
                } else {
                    res.status(400).json({ message: "Vous avez déjà liké cette sauce !" })
                }
            }

            else if (req.body.like === 0) {
                if (sauce.usersLiked.includes(req.auth.userId)) {
                    console.log("userId présent dans le tableau des likes");
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.auth.userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: "Sauce neutre !" }))
                        .catch((error) => res.status(400).json({ error }));
                } else if (sauce.usersDisliked.includes(req.auth.userId)) {
                    console.log("userId présent dans le tableau des dislikes");
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.auth.userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: "Sauce neutre !" }))
                        .catch((error) => res.status(400).json({ error }));
                } else {
                    res.status(400).json({ message: "Vous n'avez pas encore liké ou disliké la sauce" })
                }
            }

            else if (req.body.like === -1) {
                if (sauce.usersLiked.includes(req.auth.userId)) {
                    res.status(400).json({ message: "Merci d'enlever votre like avant de disliker cette sauce" });
                } else if (!sauce.usersDisliked.includes(req.auth.userId)) {
                    console.log("userId non présent dans le tableau des dislikes");
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: req.auth.userId }
                        }
                    )
                        .then(() => res.status(200).json({ message: "Sauce dislikée !" }))
                        .catch((error) => res.status(400).json({ error }));
                } else {
                    res.status(400).json({ message: "Vous avez déjà disliké cette sauce !" })
                }
            }
        })
        .catch((error) => res.status(404).json({ error }));
};


// exports.likeSauce = (req, res, next) => {
//     if (req.auth.userId != req.body.userId) {
//         res.status(400).json({ message: 'Veuillez donner les informations propres au like' });
//     } else {
//         // Chercher la Sauce dans la BDD
//         Sauce.findOne({ _id: req.params.id })
//             .then((sauce) => {
//                 console.log("--> Contenu résultat promise : sauce");
//                 console.log(sauce);

//                 if (req.body.like === 1) {
//                     if (sauce.usersDisliked.includes(req.body.userId)) {
//                         res.status(400).json({ message: "Merci d'enlever votre dislike avant de liker cette sauce" });
//                     } else if (!sauce.usersLiked.includes(req.body.userId)) {
//                         console.log("userId non présent dans le tableau des likes");

//                         Sauce.updateOne(
//                             { _id: req.params.id },
//                             {
//                                 $inc: { likes: 1 },
//                                 $push: { usersLiked: req.body.userId }
//                             }
//                         )
//                             .then(() => res.status(201).json({ message: "Sauce likée !" }))
//                             .catch((error) => res.status(400).json({ error }));
//                     } else {
//                         res.status(400).json({ message: "Vous avez déjà liké cette sauce !" })
//                     }
//                 }

//                 else if (req.body.like === 0) {
//                     if (sauce.usersLiked.includes(req.body.userId)) {
//                         console.log("userId présent dans le tableau des likes");
//                         Sauce.updateOne(
//                             { _id: req.params.id },
//                             {
//                                 $inc: { likes: -1 },
//                                 $pull: { usersLiked: req.body.userId }
//                             }
//                         )
//                             .then(() => res.status(201).json({ message: "Sauce neutre !" }))
//                             .catch((error) => res.status(400).json({ error }));
//                     } else if (sauce.usersDisliked.includes(req.body.userId)) {
//                         console.log("userId présent dans le tableau des dislikes");
//                         Sauce.updateOne(
//                             { _id: req.params.id },
//                             {
//                                 $inc: { dislikes: -1 },
//                                 $pull: { usersDisliked: req.body.userId }
//                             }
//                         )
//                             .then(() => res.status(201).json({ message: "Sauce neutre !" }))
//                             .catch((error) => res.status(400).json({ error }));
//                     } else {
//                         res.status(400).json({ message: "Vous n'avez pas encore liké ou disliké la sauce" })
//                     }
//                 }

//                 else if (req.body.like === -1) {
//                     if (sauce.usersLiked.includes(req.body.userId)) {
//                         res.status(400).json({ message: "Merci d'enlever votre like avant de disliker cette sauce" });
//                     } else if (!sauce.usersDisliked.includes(req.body.userId)) {
//                         console.log("userId non présent dans le tableau des dislikes");
//                         Sauce.updateOne(
//                             { _id: req.params.id },
//                             {
//                                 $inc: { dislikes: 1 },
//                                 $push: { usersDisliked: req.body.userId }
//                             }
//                         )
//                             .then(() => res.status(201).json({ message: "Sauce dislikée !" }))
//                             .catch((error) => res.status(400).json({ error }));
//                     } else {
//                         res.status(400).json({ message: "Vous avez déjà disliké cette sauce !" })
//                     }
//                 }
//             })
//             .catch((error) => res.status(404).json({ error }));
//     }
// };