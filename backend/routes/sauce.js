const express = require('express');
const router = express.Router()

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');

//save sauces to database
router.post('/', auth, multer, sauceCtrl.createSauce);
//get list of sauces
router.get('/', auth, sauceCtrl.getAllSauces);
//get one specific sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//Modify a sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//Delete a sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;