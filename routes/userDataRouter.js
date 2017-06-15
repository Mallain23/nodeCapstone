
const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Users} = require('../models');

router.post('/my-classes', (req, res) => {
    let username = req.body.username
    console.log(req.body)

    return Users
    .findOne({username: username})
    .exec()
    .then(user => res.status(200).json(user.classRpr()))
    .catch(err => {
      console.error(err)
      res.status(500).json({message: 'Internal Server Error'})
    });
})
module.exports = {router};
