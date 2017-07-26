const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

const {Users} = require('../models')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHTTP);

const seedData = () => {
    console.info("seeding data")
    const seedData = []

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateUserData())
    }

    return Users.insertMany(seedData);
}

const generateUserData = () => {
    return {
      username: faker.name.findName(),
      password: faker.lorem.sentence(),
      firstName: faker.name.findName(),
      lastName: faker.name.findName(),
      myResources: [{
                            title:  faker.lorem.sentence(),
                            course: faker.lorem.sentence(),
                            content: faker.lorem.sentence(),
                            typeOfResource: faker.lorem.sentence(),
                            resourceId: faker.lorem.sentence(),
                            author: faker.lorem.sentence(),
                            publishedOn: faker.lorem.sentence()
                        }],
      currentClasses: [{
                    courseName: faker.lorem.sentence(),
                    resources: [{
                      title:  faker.lorem.sentence(),
                      course: faker.lorem.sentence(),
                      content: faker.lorem.sentence(),
                      typeOfResource: faker.lorem.sentence(),
                      resourceId: faker.lorem.sentence(),
                      author: faker.lorem.sentence(),
                      publishedOn: new Date()
                    }]
                  }]
    }
};

const tearDownDb = () => {
    console.warn('tearing down database')
    return mongoose.connection.dropDatabase()
};


describe('User Data API', function() {

    before(function() {
        return runServer(TEST_DATABASE_URL);
    });

    beforeEach(function() {
        return seedData();
    })

    afterEach(function() {
        return tearDownDb()
    })

    after(function() {
        return closeServer();
    });


    describe('PUT Endpoint', function() {

        it('should add a course and return users data', function() {

            const dataObject = {
                            currentClasses: {
                                            courseName: faker.lorem.sentence(),
                                            resources: []
                                            }
                          };

            return Users
                .findOne()
                .exec()
                .then(function(user) {
                    dataObject.username = user.username
                    return chai.request(app)
                    .put(`/user-data/courses`)
                    .send(dataObject)
                })

            .then(function(res) {
                res.should.have.status(201)
                res.body.should.be.a("object")
                res.body.should.include.keys("username", "firstName", "lastName", "currentClasses", "myResources")
                res.body.currentClasses.should.be.a("array")
                res.body.currentClasses.should.have.length.of.at.least(1)

               return Users.findOne({username: dataObject.username})
               .exec()
            })
            .then(function(user) {

              let arrayOfCourses = user.currentClasses
              let addedCourse = arrayOfCourses.find(courses => courses.courseName === dataObject.currentClasses.courseName)

              addedCourse.courseName.should.equal(dataObject.currentClasses.courseName)
              addedCourse.resources.should.have.length(0)
            })
        })

        it("should add a resource and return user data", function() {

            const newDataObject =  {
                                    myResources: {
                                        content: faker.lorem.sentence(),
                                        title: faker.lorem.sentence(),
                                        typeOfResource: faker.lorem.sentence(),
                                        course: faker.lorem.sentence(),
                                        publishedOn: faker.lorem.sentence(),
                                        resourceId: faker.lorem.sentence()
                                        }
                                  };

            return Users
                .findOne()
                .exec()
                .then(function(user) {
                    newDataObject.myResources.author = user.username

                    return chai.request(app)
                    .put(`/user-data/resources`)
                    .send(newDataObject)
                })

              .then(function(res) {
                  res.should.have.status(201)
                  res.body.should.be.a("object")
                  res.body.should.include.keys("username", "firstName", "lastName", "currentClasses", "myResources")
                  res.body.myResources.should.be.a("array")
                  res.body.myResources.should.have.length.of.at.least(1)
                  res.body.myResources.every(resource => {
                    return resource.should.include.keys("author", "content", "title", "typeOfResource", "resourceId", "publishedOn", "course")
                  })

                  return Users.findOne({username: newDataObject.myResources.author})
                  .exec()
              })
              .then(function(user) {

                let arrayOfResources = user.myResources
                let addedResource = arrayOfResources.find(resources => resources.title === newDataObject.myResources.title)

                addedResource.should.not.equal(null)
                addedResource.content.should.equal(newDataObject.myResources.content)
                addedResource.publishedOn.should.equal(newDataObject.myResources.publishedOn)
                addedResource.author.should.equal(newDataObject.myResources.author)
                addedResource.typeOfResource.should.equal(newDataObject.myResources.typeOfResource)
                addedResource.resourceId.should.equal(newDataObject.myResources.resourceId)
                addedResource.course.should.equal(newDataObject.myResources.course)
              })
        })

        it("should update a resource with correct fields", function(){

            updatedResourceObject = { myResources: {
                                        content: faker.lorem.sentence(),
                                        title: faker.lorem.sentence(),
                                        typeOfResource: faker.lorem.sentence(),
                                        course: faker.lorem.sentence()
                                      }
                                  }
            return Users.findOne()
            .exec()
            .then(function(user) {
                console.log(user)
                updatedResourceObject.myResources.username = user.username
                updatedResourceObject.myResources.resourceId = user.myResources[0].resourceId

                return chai.request(app)
                .put(`/user-data/resources/${updatedResourceObject.myResources.resourceId}`)
                .send(updatedResourceObject)
            })

            .then(function(res){
                res.should.have.status(201)

                return Users.findOne({username: updatedResourceObject.myResources.username})
                .exec()
            })

            .then(function(user) {
                let revisedResource = user.myResources.find(resource => resource.resourceId === updatedResourceObject.myResources.resourceId)

                revisedResource.should.not.equal(null)
                revisedResource.title.should.equal(updatedResourceObject.myResources.title)
                revisedResource.content.should.equal(updatedResourceObject.myResources.content)
                revisedResource.typeOfResource.should.equal(updatedResourceObject.myResources.typeOfResource)
                revisedResource.course.should.equal(updatedResourceObject.myResources.course)
            })
        })

        it("should add resource to user favoirtes", function() {

            let newResourceObject = {
                                      content: faker.lorem.sentence(),
                                      title: faker.lorem.sentence(),
                                      typeOfResource: faker.lorem.sentence(),
                                      publishedOn: faker.lorem.sentence(),
                                      resourceId: faker.lorem.sentence()
                                    }
            return Users.findOne()
            .exec()
            .then(function(user) {

                newResourceObject.course = user.currentClasses[0].courseName
                newResourceObject.username = user.username

                return chai.request(app)
                .put(`/user-data/favorite-resources`)
                .send(newResourceObject)
            })

            .then(function(res) {

                res.should.have.status(201)

                return Users.findOne({username: newResourceObject.username})
                .exec()
            })

            .then(function(user) {
                let courseObject = user.currentClasses.find(course => course.courseName === newResourceObject.course)

                let newResource = courseObject.resources.find(resource => resource.resourceId === newResourceObject.resourceId)

                newResource.should.not.equal(null)
                newResource.content.should.equal(newResourceObject.content)
                newResource.title.should.equal(newResourceObject.title)
                newResource.typeOfResource.should.equal(newResourceObject.typeOfResource)
                newResource.publishedOn.should.equal(newResourceObject.publishedOn)
            })
        })
    })

    describe('DELETE endpoint', function() {

        it("should delete a course from users courses", function(){

            let removeCourseDataObject = {
                                          currentClasses: {courseName: ''}
            }
            return Users.findOne()
            .exec()
            .then(function(user) {
                removeCourseDataObject.username = user.username
                removeCourseDataObject.currentClasses.courseName = user.currentClasses[0].courseName

                return chai.request(app)
                .delete(`/user-data/courses`)
                .send(removeCourseDataObject)
            })

            .then(function(res) {
                res.should.have.status(201)

                return Users.findOne({username: removeCourseDataObject.username})
                .exec()
            })
            .then(function(user) {
                let doesCourseExist = user.currentClasses.some(course => course.CourseName === removeCourseDataObject.currentclasses.courseName)

                doesCourseExist.should.equal(false)
            })
        })

        it("should delete a resource from users resources", function() {

            let currentUser
            let resourceId

            return Users.findOne()
            .exec()
            .then(function(user) {
                resourceId = user.myResources[0].resourceId
                currentUser = user.username

                return chai.request(app)
                .delete(`/user-data/resources/${resourceId}`)
            })
            .then(function(res) {
              res.should.have.status(201)

              return Users.findOne({username: currentUser})
              .exec()
            })
            .then(function(user){
              let doesResourceExist = user.myResources.some(resource => resource.resourceId === resourceId)
              doesResourceExist.should.equal(false)
            })
        })

        it("should delete a users favorite resource", function() {
            let resourceId
            let deleteResourceData = {}

            return Users.findOne()
            .exec()
            .then(function(user) {
                deleteResourceData.username = user.username
                deleteResourceData.courseName = user.currentClasses[0].courseName
                resourceId = user.currentClasses[0].resources[0].resourceId

                return chai.request(app)
                .delete(`/user-data/favorite-resources/${resourceId}`)
                .send(deleteResourceData)
            })

            .then(function(res) {
                res.should.have.status(201)

                return Users.findOne({username: deleteResourceData.username})
                .exec()
            })
            .then(function(user) {

                let courseObject = user.currentClasses.find(courses => {
                    return courses.courseName ===  deleteResourceData.courseName
                })

                let doesResourceExist = courseObject.resources.some(resouce => resource.resourceId === resourceId)

                doesResourceExist.should.equal(false)
            })
        })
    })
})
