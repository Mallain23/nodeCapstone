const express = require('express');

const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Users} = require('../models');



//this function updates courses (adds a course) to user
router.put('/courses', (req, res) => {
    if (!'currentClasses' in req.body || !'username' in req.body) {
        console.error("Missing required field in request body ")
        return
  }

  let username = req.body.username;
  let toUpdate = {}

  toUpdate.currentClasses = req.body.currentClasses

  return Users
  .findOne({username: username})
  .exec()

  .then(user => {
      return Users
      .findByIdAndUpdate(user._id, {$addToSet: {currentClasses: toUpdate.currentClasses}}, {new: true})
      .exec()
   })

   .then(user => res.status(201).json(user.apiRpr()))
   .catch(err => {
      console.log(err)
      res.status(500).json({message: 'Internal Server Error'})
   })
})

//this function deletes a course from user database
router.delete('/courses', (req, res) => {
    let className = req.body.currentClasses
    let username = req.body.username

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


//this function adds a resource to user database
router.put('/resources', (req, res) => {
    console.log(req.body.myResources)
    const username = req.body.myResources.username;
    const objectToAddToDataBase = {}

    const requiredFields = ['content', 'course', 'title', 'typeOfResource', 'resourceId', 'publishedOn', 'username']
    const missingFields = requiredFields.filter(field => !field in req.body)

    if (missingFields.length > 0) {
        const message = `Request is missing ${missingFields.length} fields.`
        console.error(message)

        return res.status(400).send(message)
    }

    objectToAddToDataBase.myResources = req.body.myResources

    return Users
    .findOne({username: username})
    .exec()

    .then(user => {
        return Users
        .findByIdAndUpdate(user._id, {$addToSet: {myResources: objectToAddToDataBase.myResources}}, {new: true})
        .exec()
     })

     .then(user => res.status(201).json(user.apiRpr()))
     .catch(err => {
        console.log(err)
        res.status(500).json({message: 'Internal Server Error'})
     })
});


//this function updates a resource in the database
router.put('/resources/:id', (req, res) => {
    let {username, content, resourceId, title, publishedOn, typeOfResource, course } = req.body.myResources

    if (!(req.params.id && resourceId && req.params.id === resourceId)) {
        const message = (`Request path id '(${req.params.id})' and request body id '(${resourceId})' must match`);
        console.error(message);
        res.status(400).json({message: message});
    }

    return Users
    .findOneAndUpdate({username: username, "myResources.resourceId": resourceId}, {$set: {"myResources.$.content": content, "myResources.$.title": title, "myResources.$.typeOfResource": typeOfResource, "myResources.$.course": course}}, {new: true})
    .exec()
    .then(user => {
        return Users
        .findOne({username: username})
        .exec()
    })
    .then(user => res.status(201).json(user.apiRpr()))
})


//this function deletes a resource from user database
router.delete('/resources/:id', (req, res) => {
    if (!req.params.id) {
        const message = `Request path is missing request ID.`
        console.error(message)

        return res.status(400).send(message)
    }

    let resourceId = req.params.id

    return Users
    .find({myResources: {$elemMatch: {resourceId: resourceId}}}, {myResources: {$elemMatch: {resourceId, resourceId}}})
    .exec()

    .then(user => {
        return Users
        .findByIdAndUpdate(user[0]._id, {$pull: {myResources: {resourceId: resourceId}}}, {new: true})
        .exec()
    })

    .then(user => res.status(201).json(user.apiRpr()))
    .catch(err => res.status(500).json({message: "Internal Server Error"}))
});


//this function will add resource to favorite resources
router.put('/favorite-resources', (req, res) => {
    const requiredFields = ['content', 'course', 'title', 'typeOfResource', 'username', 'resourceId', 'publishedOn' ]

    const missingFields = requiredFields.filter(field =>  !field in req.body)

    if (missingFields.length > 0) {
        const message = `Request is missing ${missingFields.length} fields.`
        console.error(message)

        return res.status(400).send(message)
    }

    let {username, content, resourceId, title, publishedOn, typeOfResource, course } = req.body
    let toUpdate = { title:  title,
                    course: course,
                    content: content,
                    typeOfResource: typeOfResource,
                    resourceId: resourceId,
                    username: username,
                    publishedOn: publishedOn
                }

      return Users
      .update({username: username, "currentClasses.courseName": course}, {$addToSet: {"currentClasses.$.resources": toUpdate}}, {new: true})
      .exec()
      .then(user => {
          return Users
          .findOne({username: username})
          .exec()
        })

        .then(user => res.status(201).json(user.apiRpr()))

        .catch(err => {
            console.log(err)
            res.status(500).json({message: 'Internal Server Error'})
        })
    })

router.delete('/favorite-resources/:id', (req, res) => {

    let resourceId = req.params.id
    let {username, courseName} = req.body

    return Users
    .findOneAndUpdate({username: username, "currentClasses.courseName": courseName}, {$pull: {"currentClasses.$.resources": {resourceId: resourceId}}}, {new: true})
    .exec()
    .then(user => res.status(201).json(user.apiRpr()))

    .catch(err => res.status(500).json({message: "Internal Server Error"}))
 })


module.exports = {router}
