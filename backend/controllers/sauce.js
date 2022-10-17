const Sauce = require('../models/Sauce');
const fs = require('fs');

const formRegExp = /^(.|\s)*\S(.|\s)*$/;

// exports.createSauce = (req, res, next) => {
//     const sauceObject = JSON.parse(req.body.sauce);
//     sauceObject.dislikes = 0;
//     sauceObject.likes = 0;
//     // delete sauceObject._id;
//     // delete sauceObject._userId;
//     const sauce = new Sauce({
//         ...sauceObject,
//         userId: req.auth.userId,
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//     });
//     sauce.save()
//         .then(() => { res.status(201).json({ message: 'Sauce ajoutée !' }) })
//         .catch(error => { res.status(400).json({ error }) })
// };

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
        throw 'ERREUR : Merci de remplir tous les champs';
        // console.log("Merci de remplir tous les champs");
    }
};



// exports.modifySauce = (req, res, next) => {
//     const sauceObject = req.file ? {
//         ...JSON.parse(req.body.sauce),
//         imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
//         // Vérifier ce que le protocol fait ici
//     } : { ...req.body }

//     delete sauceObject._userId;
//     Sauce.findOne({ _id: req.params.id })
//         .then((sauce) => {
//             if (sauce.userId != req.auth.userId) {
//                 res.status(401).json({ message: 'Non autorisé' });
//             } else {
//                 Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
//                     // .then(() => res.status(204).json(''))
//                     .then(() => res.status(204).json({ message: 'Sauce modifiée !' }))
//                     .catch(error => res.status(401).json({ error }));
//             }
//         })
//         .catch(error => res.status(404).json({ error: 'Not found' }))
// };

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    ///// TEST SUPPRESSION PHOTO //////
    const photos = fs.readdirSync('./images/');
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
    ///////////////////////////////////

    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' });
            } else {
                if ((formRegExp.test(req.body.name)) && (formRegExp.test(req.body.manufacturer)) && (formRegExp.test(req.body.description)) && (formRegExp.test(req.body.mainPepper))) {
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }));
                } else {
                    // A retravailler
                    throw 'ERREUR : Merci de remplir tous les champs';
                }
            }
        })
        .catch(error => res.status(404).json({ error: 'Not found' }))
};


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'Non autorisé' })
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