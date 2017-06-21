const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Users} = require('../models');



router.put('/courses', (req, res) => {
  if (!'currentClasses' in req.body || !'username' in req.body) {
      console.error("Missing required field in request body ")
      return
  }

  let username = req.body.username;
  let toUpdate = {}

  toUpdate.currentClasses =  req.body.currentClasses
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

router.put('/resources', (req, res) => {
    console.log("asdas", req.body)
    const username = req.body.uploadedResources.username
    const objectToAddToDataBase = {}
    const requiredFields = ['content', 'course', 'title', 'type', 'resourceId', 'publishedOn', 'username']


    const missingFields = requiredFields.filter(field => {
        return !field in req.body
    })

    if (missingFields.length > 0) {
        const message = `Request is missing ${missingFields.length} fields.`
        console.error(message)

        return res.status(400).send(message)
    }
    // requiredFields.forEach(field => {
    //     if (field in req.body) {
    //         objectToAddToDataBase[field] = req.body[field]
    //     }
    // });
    objectToAddToDataBase.uploadedResources = req.body.uploadedResources
    console.log(objectToAddToDataBase)
   return Users
   .findOne({username: username})
   .exec()
   .then(user => {
       return Users
       .findByIdAndUpdate(user._id, {$addToSet: {uploadedResources: objectToAddToDataBase.uploadedResources}}, {new: true})
       .exec()
    })
    .then(user => {
      console.log("22", user)
      res.status(201).json(user.apiRpr())
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({message: 'Internal Server Error'})
    })
})


router.delete('/courses', (req, res) => {
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

// router.delete('/courses', (req, res) => {
//   let resourceName = req.body.uploadedResources
//   let username = req.body.username
//
//
//   return Users
//   .findOne({username: username})
//   .exec()
//   .then(user => {
//     return Users
//   .findByIdAndUpdate(user._id, {$pull: {uploadedResources: resourceName}}, {new: true})
//   .exec()
//   })
//   .then(user => {
//     res.status(201).json(user.apiRpr())
//   })
//   .catch(err => {
//     console.log(err)
//     res.status(500).json({message: "Internal Server Error"})
//   })
// })

module.exports = {router}
