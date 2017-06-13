const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {StudyResources} = require('../models');

router.get('/', (req, res) => {
    const filters = {};
    const queryableFields = ['course', 'professor', 'username'];

    queryableFields.forEach(field => {
        if (req.query[field]) {
              filters[field] = req.query[field];
        }
    })
    console.log(filters)
    StudyResources
        .find(filters)
        .exec()
        .then(Resources => res.json(Resources.map(resource => resource.apiRpr())))
        .catch(err => {
              console.error(err);
              res.status(500).json({message: 'internal server error'})
        })
})


router.post('/', (req, res) => {
    const requiredFields = ['content', 'course', 'title', 'type']

    const missingFields = requiredFields.filter(field => {
        return !field in req.body
    })

    if (missingFields.length > 0) {
        const message = `Request is missing ${missingFields.length} fields.`
        console.error(message)

        return res.status(400).send(message)
    }

    StudyResources
        .create({
          title: req.body.title,
          type: req.body.type,
          content:req.body.content,
          course: req.body.course,
          professor: req.body.professor,
        })
        .then(Resource =>  res.status(201).json(Resource.apiRpr()))
        .catch(err => {
          console.error(err);
          res.status(500).json({message: 'Internal Server Error'})
        })
    })


module.exports = router;
