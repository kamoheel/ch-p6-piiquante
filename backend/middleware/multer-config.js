//file downloads
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        //récupérer le nom original, remplacer les espaces par des _
        const name = file.originalname.split(' ').join('_');
        //récupérer l'extension
        const extension = MIME_TYPES[file.mimetype];
        //générer nom suffisemment unique, nom+timestamp+.+extension
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image');