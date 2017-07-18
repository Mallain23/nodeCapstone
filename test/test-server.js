// const chai = require('chai');
// const chaiHTTP = require('chai-http');
// const faker = require('faker');
// const mongoose = require('mongoose');
//
// const {app, runServer, closeServer} = require('../server');
//
// const should = chai.should();
//
// const {StudyResources} = require('../models')
// const {TEST_DATABASE_URL} = require('../config')
//
// chai.use(chaiHTTP);
//
// const seedData = () => {
//     console.info("seeding data")
//     const seedData = []
//
//     for (let i = 1; i <= 10; i++) {
//         seedData.push(generateStudyResourceData())
//     }
//
//     return StudyResources.insertMany(seedData);
// }
//
// const generateStudyResourceData = () => {
//     return {
//
//         title: faker.lorem.sentence(),
//         typeOfResource: faker.lorem.sentence(),
//         username: faker.name.findName(),
//         course: faker.lorem.sentence(),
//         professor: faker.lorem.sentence(),
//         content: faker.lorem.sentence(),
//         publishedOn: new Date()
//     }
// }
//
// const tearDownDb = () => {
//     console.warn('tearing down database')
//     return mongoose.connection.dropDatabase()
// };
//
//
// describe('Studyguide Resource API', function() {
//
//     before(function() {
//         return runServer(TEST_DATABASE_URL);
//     });
//
//     beforeEach(function() {
//         return seedData();
//     })
//
//     afterEach(function() {
//         return tearDownDb()
//     })
//
//     after(function() {
//         return closeServer();
//     });
//
//     describe('GET Endpoint', function() {
//
//         it('should return resources with the correct fields', function() {
//
//             return chai.request(app)
//             .get('/resources')
//             .then(function(res) {
//
//                 res.should.have.status(200)
//                 res.should.be.json
//                 res.body.should.be.a('array')
//                 res.body.should.have.length.of.at.least(1)
//
//                 res.body.forEach(resource => {
//                     resource.should.be.a('object')
//                     resource.should.include.keys('title', 'content', 'course', 'username', 'id', 'typeOfResource')
//                 })
//                 resResource = res.body[0]
//
//                 return StudyResources.findById(resResource.id).exec()
//             })
//             .then(function(resource) {
//                 resResource.title.should.equal(resource.title)
//                 resResource.course.should.equal(resource.course)
//                 resResource.content.should.equal(resource.content)
//                 resResource.username.should.equal(resource.username)
//                 resResource.typeOfResource.should.equal(resource.typeOfResource)
//             })
//        })
//
//        it('should filter resources by the user filters', function() {
//
//           let courseFilter
//
//           StudyResources
//           .findOne()
//           .exec()
//           .then(function(resource) {
//               courseFilter = resource.course
//               return chai.request(app)
//               .get(`/resources/?course=${courseFilter}`)
//           })
//
//           .then(function(res) {
//               res.body.forEach(resource => {
//                   resource.course.should.equal(courseFilter)
//               })
//           })
//       })
//   })
//
//     describe('POST Endpoint', function() {
//
//         it('should add a new resource on POST', function() {
//
//             const newResource = {
//               title: "sample new title",
//               content: "sample new content",
//               course: "contracts",
//               typeOfResource: "study guide"
//             }
//
//             return chai.request(app)
//             .post('/resources')
//             .send(newResource)
//             .then(function(res) {
//
//                 res.should.have.status(201)
//                 res.should.be.json
//                 res.body.should.be.a('object')
//                 res.body.should.include.keys('title', 'content', 'course', 'typeOfResource', 'id')
//                 res.body.title.should.equal(newResource.title)
//                 res.body.content.should.equal(newResource.content)
//                 res.body.course.should.equal(newResource.course)
//                 res.body.typeOfResource.should.equal(newResource.typeOfResource)
//                 res.body.id.should.not.be.null
//
//                 return StudyResources.findById(res.body.id).exec()
//             })
//             .then(function(resource) {
//
//                 resource.title.should.equal(newResource.title)
//                 resource.content.should.equal(newResource.content)
//                 resource.typeOfResource.should.equal(newResource.typeOfResource)
//                 resource.course.should.equal(newResource.course)
//             })
//         })
//     })
//
//     describe('PUT Endpoint', function() {
//
//         it('should update a resource with correct fields', function() {
//
//             const updatedResource = {
//               title: 'new title',
//               content: 'new content',
//               course: 'new course',
//               typeOfResource: 'new type'
//             }
//
//             return StudyResources
//             .findOne()
//             .exec()
//             .then(function(resource) {
//                 updatedResource.id = resource.id
//                 return chai.request(app)
//                 .put(`/resources/${resource.id}`)
//                 .send(updatedResource)
//             })
//
//             .then(function(res) {
//
//                 res.should.have.status(201)
//                 return StudyResources.findById(updatedResource.id).exec()
//             })
//
//             .then(function(resource) {
//                 resource.title.should.equal(updatedResource.title)
//                 resource.content.should.equal(updatedResource.content)
//                 resource.typeOfResource.should.equal(updatedResource.typeOfResource)
//                 resource.course.should.equal(updatedResource.course)
//             })
//         })
//     })
//
//     describe('Delete Endpoint', function() {
//
//         it('should delete a resource', function() {
//
//             let resourceId
//
//             return StudyResources
//             .findOne()
//             .exec()
//             then(function(resource) {
//                 resourceId = resource.id
//                 return chai.request(app)
//                 .delete(`resource/${resourceId}`)
//             })
//
//             .then(function(res) {
//                 res.should.have.status(204)
//                 return StudyResources.findById(resourceId).exec()
//             })
//
//             .then(function(resource) {
//                 resource.should.not.exist;
//             })
//         })
//     })
//
//     describe('Root server endpoint', function() {
//
//         it('reuqest to root server should return 200 status code', function() {
//
//             return chai.request(app)
//             .get('/')
//             .then(function(res) {
//                 res.should.have.status(200);
//             })
//         })
//     })
// })
