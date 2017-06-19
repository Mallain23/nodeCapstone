const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Users} = require('../models');



router.put('/', (req, res) => {
  if (!'currentClasses' in req.body || !'username' in req.body) {
      console.error("Missing required field in request body ")
      return
  }

  let username = req.body.username;
  let toUpdate = {}


  toUpdate.currentClasses =  req.body.currentClasses
  console.log(toUpdate)
    console.log(toUpdate.currentClasses)

  return Users
  .findOne({username: username})
  .exec()
  .then(user => {
      return Users
      .findByIdAndUpdate(user._id, {$addToSet: {currentClasses: toUpdate.currentClasses}}, {new: true})
      .exec()
   })
   .then(user => {
     res.status(201).json(user.apiRpr())
   })
   .catch(err => {
     console.log(err)
     res.status(500).json({message: 'Internal Server Error'})
   })
})

router.delete('/', (req, res) => {
  let className = req.body.currentClasses
  let username = req.body.username
  console.log(className)
  return Users
  .findOne({username: username})
  .exec()
  .then(user => {
    return Users
  .findByIdAndUpdate(user._id, {$pull: {currentClasses: className}}, {new: true})
  .exec()
  })
  .then(user => {
    res.status(201).json(user.apiRpr())
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({message: "Internal Server Error"})
  })
})

module.exports = {router};
