const express = require("express");
const app = express();
const Pangolin = require("../models/pangolin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Route pour obtenir la liste des pangolins
app.get("/", async (req, res) => {
  try {
    const pangolins = await Pangolin.find();
    res.json(pangolins);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des pangolins" });
  }
});

// Route pour obtenir les détails d'un pangolin spécifique
app.get("/:id", async (req, res) => {
  try {
    const pangolin = await Pangolin.findById(req.params.id);
    if (!pangolin) {
      return res.status(404).json({ message: "Pangolin non trouvé" });
    }
    res.json(pangolin);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du pangolin" });
  }
});

// Route pour mettre à jour les détails d'un pangolin spécifique
app.put("/:id", async (req, res) => {
  try {
    const pangolin = await Pangolin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pangolin) {
      return res.status(404).json({ message: "Pangolin non trouvé" });
    }
    res.json(pangolin);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du pangolin" });
  }
});

// Route pour supprimer un pangolin spécifique
app.delete("/:id", async (req, res) => {
  try {
    const pangolin = await Pangolin.findByIdAndDelete(req.params.id);
    if (!pangolin) {
      return res.status(404).json({ message: "Pangolin non trouvé" });
    }
    res.json({ message: "Pangolin supprimé avec succès" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du pangolin" });
  }
});

// Route pour ajouter un ami à un pangolin
app.post("/:id/ajouter-ami", async (req, res) => {
  try {
    const pangolin = await Pangolin.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { friends: req.body.friendId } },
      { new: true }
    );

    if (!pangolin) {
      return res.status(404).json({ message: "Pangolin non trouvé" });
    }

    res.json(pangolin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout de l'ami" });
  }
});



// Route pour supprimer un ami d'un pangolin
app.post("/:id/supprimer-ami", async (req, res) => {
  try {
    const pangolin = await Pangolin.findByIdAndUpdate(
      req.params.id,
      { $pull: { friends: req.body.friendId } },
      { new: true }
    );
    if (!pangolin) {
      return res.status(404).json({ message: "Pangolin non trouvé" });
    }
    res.json(pangolin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'ami" });
  }
});

// Route pour l'inscription d'un nouveau pangolin
app.post("/inscription", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Vérifiez si un pangolin avec le même nom d'utilisateur existe déjà
    const existingPangolin = await Pangolin.findOne({ username });

    if (existingPangolin) {
      return res
        .status(400)
        .json({ message: "Nom d'utilisateur déjà utilisé" });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPangolin = new Pangolin({
      username,
      password: hashedPassword,
      role,
    });

    await newPangolin.save();

    res.status(201).json(newPangolin);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de l'inscription du pangolin" });
  }
});

// Route pour la connexion d'un pangolin
app.post("/connexion", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Recherchez le pangolin correspondant au nom d'utilisateur fourni
    const pangolin = await Pangolin.findOne({ username });

    if (!pangolin) {
      return res.status(404).json({ message: "Nom d'utilisateur invalide" });
    }

    // Vérifiez si le mot de passe est correct
    const isPasswordValid = await bcrypt.compare(password, pangolin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Mot de passe invalide" });
    }

    // Générez un token d'authentification pour le pangolin
    const token = jwt.sign({ username: pangolin.username }, "secret_key");

    res.json({ pangolin, token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la connexion du pangolin" });
  }
});

// Route pour la recherche de pangolins
app.get("/recherche", async (req, res) => {
  try {
    const { username, role } = req.query;
    let query = {};
    if (username) {
      query.username = username;
    }
    if (role) {
      query.role = role;
    }
    const pangolins = await Pangolin.find(query);
    res.json(pangolins);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la recherche des pangolins" });
  }
});

module.exports = app;
