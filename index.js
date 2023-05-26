const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const { database } = require('./config');
require('dotenv').config();

// Middleware
app.use(express.json());

// Activer CORS
app.use(cors());

// Connexion à la base de données MongoDB
mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à la base de données MongoDB établie');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données MongoDB:', error);
  });

// Définition des routes de l'API
const pangolinRoutes = require('./routes/pangolin');
app.use('/', pangolinRoutes);

// Démarrage du serveur
app.listen(process.env.PORT, () => {
  console.log(`Le serveur est en écoute sur le port ${process.env.PORT}`);
});
