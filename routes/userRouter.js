const {BasicStrategy} = require('passport-http');

const passport = require('passport');


const express = require('express');


const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Users} = require('../models');




const basicStrategy = new BasicStrategy((username, password, callback) => {

    let user
    return Users
    .findOne({username: username})
    .exec()
    .then(_user => {

        user = _user
        if(!user) {

            return callback(null, false)
        }

        return user.validatePassword(password)
    })
    .then(isValid => {

        if (!isValid) {

            return callback(null, false)
        }
        return callback(null, user);
    })
    .catch(err => callback(err))
})





passport.use(basicStrategy)

router.use(passport.initialize());

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});



router.post('/', (req, res) => {
    console.log("correct")
    if (!req.body) {

        return res.status(400).json({message: 'no request body'})
    }

    if (!('username' in req.body)) {

        return res.status(422).json({message: 'Missing field: username'})
    }

    let {username, password, firstName, lastName} = req.body

    if (typeof username !== 'string') {

        return res.status(422).json({message: 'Incorrect field type: username'})

    }

    username = username.trim()

    if (username === '') {
        return res.status(422).json({messaage: 'Incorect field length: username'})
    }

    if (!password) {

        return res.status(422).json({message: 'Missing field: password'})
    }

    if (typeof password !== 'string') {

        return res.status(422).json({message: 'Incorrect field type: password'})
    }

    password = password.trim()

    if (password === '') {

        return res.status(422).json({message: 'Incorrect field length: password'})
    }

    return Users
        .find({username})
        .count()
        .exec()
        .then(count => {
            if(count > 0) {
                console.log("error")
                return res.status(422).json({message: 'username already taken'})
            }
            return Users.hashPassword(password)
        })
        .then(hash => {

            return Users
                .create({
                    username: username,
                    password: hash,
                    firstName: firstName,
                    lastName: lastName,
                    currentClasses: [],
                    uploadedResources: [],
                })
        })
        .then(user => {
          return res.status(201).json(user.apiRpr())
        })
        .catch(err => {
          console.error(err)
          res.status(500).json({message: 'Internal Server Error'})
        })
})



router.post('/welcome', passport.authenticate('basic', {session: true}), (req, res) => {
        res.json({user: req.user.apiRpr(), token: new Date()})
})



module.exports = {router};
