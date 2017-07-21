const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {StudyResources} = require('../models');


router.get('/', (req, res) => {
    const filters = {};
    const queryableFields = ['course', 'typeOfResource', 'username', 'title', '_id'];

    queryableFields.forEach(field => {
        if (req.query[field]) {
              filters[field] = req.query[field];
        }
    })

    StudyResources
        .find(filters)
        .exec()
        .then(Resources => res.json(Resources.map(resource => resource.apiRpr())))
        .catch(err => {
              console.error(err);
              res.status(500).json({message: 'internal server error'})
        })
});


router.post('/', (req, res) => {

    const todaysDate = new Date().toLocaleString();
    const requiredFields = ['content', 'course', 'title', 'typeOfResource']

    const missingFields = requiredFields.filter(field =>  !field in req.body)

    if (missingFields.length > 0) {
        const message = `Request is missing ${missingFields.length} fields.`
        console.error(message)

        return res.status(400).send(message)
    }

    StudyResources
        .create({
          title: req.body.title,
          typeOfResource: req.body.typeOfResource,
          content:req.body.content,
          course: req.body.course,
          publishedOn: todaysDate,
          username: req.body.username
        })
        .then(Resource =>  res.status(201).json(Resource.apiRpr()))
        .catch(err => {
          console.error(err);
          res.status(500).json({message: 'Internal Server Error'})
        })
    })


router.put('/:id', (req, res) => {
    if (!req.params.id) {
        const message = `Required field "ID" is missing from request path`

        console.error(message)
        res.status(400).json({message: message})
    }

    const resourceId = req.params.id
    const toUpdate = {};
    const updateableFields = ['title', 'content', 'course', 'typeOfResource'];

    updateableFields.forEach(field => {
        if (field in req.body) {
            toUpdate[field] = req.body[field]
        }
    })

    StudyResources
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}, {new: true})
    .exec()
    .then(resource => res.status(201).json(resource.apiRpr()))
    .catch(err => res.status(500).json({message: 'Internal Server Error'}))
})


router.delete('/:id', (req, res) => {
    if (!req.params.id) {
        const message = `Request path is missing request ID.`
        console.error(message)

        return res.status(400).send(message)
    }

    let resourceId = req.params.id

    return StudyResources
    .findOneAndRemove({_id: resourceId})
    .exec()
    .then((resource) =>  res.status(201).json(resource))
    .catch(err => res.status(500).json({message: 'Internal Server Error'}))
})

module.exports = {router};
