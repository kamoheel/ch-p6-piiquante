const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
//helmet helps protect from a few vulnerabilities by setting up HTTP headers
const helmet = require('helmet');
//to put MongoDB access credentials in .env variable
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express();

//Connect to MongoDB with mongoose
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.4dih33v.mongodb.net/piiquante?retryWrites=true&w=majority`,
{ useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Uses the default Helmet options and adds the `crossOriginResourcePolicy` middleware that allows images
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));
//to handle POST request, we need to extract the JSON body:
app.use(express.json());

//for CORS errors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//authentification routes
app.use('/api/auth', userRoutes);
//sauces routes
app.use('/api/sauces', sauceRoutes);
//routing handler
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;