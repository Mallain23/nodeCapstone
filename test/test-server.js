const chai = require('chai');
const chaiHTTP = require('chai-http');
const faker = require('faker');

const {app, runServer, closeServer} = require('../server');

const should = chai.should();

const {StudyResources} = require('../models')
const {TEST_DATABASE_URL} = require('../config')

chai.use(chaiHTTP);

const seedData = () => {
    console.info("seeding data")
    const seedData = []

    for (let i = 1; i <= 10; i++) {
        seedData.push(generateStudyResourceData())
    }

    return StudyResources.insertmany(seedData);
}

const generateStudyResourceData () => {
    return {

        title: faker.lorem.sentence(),
        type: faker.lorem.sentence(),
        username: faker.name.findName(),
        course: faker.lorem.sentence(),
        professor: faker.lorem.sentence(),
        content: faker.lorem.sentence(),
        popularity: math.rabdom(),
        publishedOn: new Date()

    }
}

const tearDownDb = () => {
    console.warn('tearing down database')
    return mongoose.connection.dropDatabase()
};


describe('Studyguide Resource API', function() {

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

    it('reuqest to root server should return 200 status code', function() {
        return chai.request(app)
        .get('/')
          .then(function(res) {
            res.should.have.status(200);
          })
        })
    })
