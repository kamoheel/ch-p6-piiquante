const Sauce = require('../models/Sauce');
//for delete function, to remove the image:
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    //delete id given by front end and given by user
    delete sauceObject._id;
    //delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        //userId extracted from token by auth middleware
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    //si req.file existe, on traite la nouvelle image, sinon on traite simplement l'objet entrant
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message : 'Unauthorized request'});
            } else {
                if(req.file) {
                    //delete previous image if a file(img) was added
                    const filename = sauce.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                    .catch(error => res.status(401).json({ error }));
                    });
                } else {
                    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                    .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
                    .catch(error => res.status(401).json({ error }));
                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
 };


exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                        .catch(error => res.status(400).json({ error }));
                });
            }
        })
        .catch( eroor => {
            res.status(500).json({ error });
        });
};

exports.likeDislikeSauce = (req, res, next) => {
        if (req.body.like === 1) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                .then((sauce) => res.status(200).json({ message: 'Like ajouté !' }))
                .catch(error => res.status(400).json({ error }));
        } else if (req.body.like === -1) {
            Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((sauce) => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }));
        } else {
            Sauce.findOne({ _id: req.params.id })
                .then(sauce => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: {usersLiked: req.body.userId}, $inc: { likes: -1 } })
                            .then((sauce) => { res.status(200).json({ message: 'Like supprimé' })})
                            .catch(error => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                            .then((sauce) => { res.status(200).json({ message: 'Dislike supprimé' }) })
                            .catch(error => res.status(400).json({ error }))
                    }
                })
                .catch(error => res.status(400).json({ error }));
        }
}

