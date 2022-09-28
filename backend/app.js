const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { restart } = require('nodemon');

const userRoutes = require('./routes/user');

const User = require('./models/User');

mongoose.connect('mongodb+srv://hcdnt:KdYYjVt2Hg5JcXUD@cluster0.sf5l5zq.mongodb.net/?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// app.use(bodyParser.json());

app.use('/api/auth', userRoutes);

app.post('/api/user', (req, res, next) => {
    const user = new User({
        ...req.body
    });
    user.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
});

module.exports = app;