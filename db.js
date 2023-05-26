const mongoose = require('mongoose');
const { database } = require('./config');

mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à la base de données MongoDB établie');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données MongoDB:', error);
  });
