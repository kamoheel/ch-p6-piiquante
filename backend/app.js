const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();

//Connect to MongoDB with mongoose
mongoose.connect('mongodb+srv://kaminda:gddpfw64@cluster0.4dih33v.mongodb.net/piiquante?retryWrites=true&w=majority',
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));



//for CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

 //to handle POST request, we need to extract the JSON body:
app.use(express.json());

//authentification routes
app.use('/api/auth', userRoutes);
//sauces routes
app.use('/api/sauces', sauceRoutes);
//routing handler
app.use('/images', express.static(path.join(__dirname, 'image')));

module.exports = app;