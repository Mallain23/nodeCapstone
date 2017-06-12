const chai = require('chai');
const chaiHTTP = require('chai-http');

const {app, runServer, closeServer} = require('../server.js');

const should = chai.should();

chai.use(chaiHTTP);

describe('Users', function() {

    before(function() {
        return runServer();
    });


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
