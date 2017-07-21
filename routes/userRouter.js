const {BasicStrategy} = require('passport-http');

const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const express = require('express');
const session = require('express-session')
const flash = require('connect-flash')

const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Users} = require('../models');

router.use(flash())

const localStrategy = new LocalStrategy({passReqToCallback: true}, (req, username, password, callback) => {

    let user
    return Users
    .findOne({username: username})
    .exec()
    .then(_user => {

        user = _user
        if(!user) {
            console.log("req.flash", req.flash)
            return callback(null, false)
        }

        return user.validatePassword(password)
    })
    .then(isValid => {

        if (!isValid) {

            return callback(null, false, {message: req.flash('Incorrect Password')})
        }
        return callback(null, user);
    })
    .catch(err => callback(err))
})







// const basicStrategy = new BasicStrategy((username, password, callback) => {
//
//     let user
//     return Users
//     .findOne({username: username})
//     .exec()
//     .then(_user => {
//
//         user = _user
//         if(!user) {
//
//             return callback(null, false, {message: 'Invalid Username'})
//         }
//
//         return user.validatePassword(password)
//     })
//     .then(isValid => {
//
//         if (!isValid) {
//
//             return callback(null, false)
//         }
//         return callback(null, user);
//     })
//     .catch(err => callback(err))
// })





//passport.use(basicStrategy)
passport.use(localStrategy)
router.use(session({secret: '755North755North755North'}))
router.use(passport.initialize());
router.use(passport.session())


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});




router.post('/', (req, res) => {
  console.log(req.body)
    if (!req.body) {

        return res.json({message: 'No request body'})
    }

    if (!('username' in req.body)) {

        return res.json({message: 'Missing field: username. Make sure to fill out the username field.'})
    }

    let {username, password, firstName, lastName} = req.body

    if (typeof username !== 'string') {

        return res.json({message: 'Incorrect field type: username'})

    }

    username = username.trim()

    if (username === '') {
        return res.json({message: 'Missing field: username. Make sure to fill out the username field. '})
    }

    if (!password) {

        return res.json({message: 'Missing field: password. Make sure to fill out the password field.'})
    }

    if (typeof password !== 'string') {

        return res.json({message: 'Incorrect field type: password'})
    }

    password = password.trim()

    if (password === '') {

        return res.json({message: 'Missing field: password. Make sure to fill out the password field'})
    }

    return Users
        .find({username})
        .count()
        .exec()
        .then(count => {
            if(count > 0) {
                console.log("error")
                return res.json({message: 'username already taken'})
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


router.post('/welcome', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
      if (err) {
          return next(err);
      }

      if (!user) {

          return res.json({message: 'Incorrect username or password'})
      }

      req.logIn(user, function(err) {

          if (err) {
            return next(err);
          }

          return res.json({user: user.apiRpr(), token: new Date()});
      });
  })(req, res, next);
});

router.post('/change-password', function(req, res) {

    let {username, oldPassword, newPassword} = req.body

    return Users.findOne({username: username})
        .exec()
        .then(function(user) {

            if(!user) {

            return res.json({message: "User does not exist"})
        }
        if (user.validatePassword(oldPassword) === false) {

            return res.json({message: "Incorrect Old Password"})
        }

          if (!newPassword) {

              return res.json({message: 'Missing field: password. Make sure to fill out the password field.'})
          }

          if (typeof newPassword !== 'string') {

              return res.json({message: 'Incorrect field type: password'})
          }

          newPassword = newPassword.trim()

          if (newPassword === '') {

              return res.json({message: 'Missing field: password. Make sure to fill out the password field'})
          }

          return Users.hashPassword(newPassword)
          .then(function(hash) {

              return Users.findOneAndUpdate({username: username}, {password: hash})
              .exec()
          })

          .then(function(user) {
              res.status(201).json(user)
          })
          .catch(err => {
              console.error(err)
              res.status(500).json({message: 'Internal Server Error'})
          })
      })
})



module.exports = {router};
