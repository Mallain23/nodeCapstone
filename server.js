const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser')
const morgan = require('morgan')


const {PORT, DATABASE_URL} = require('./config');
const resourceRouter = require('./routes/resourceRouter')

const app = express();

mongoose.Promise = global.Promise;

app.use(bodyParser.json());
app.use(morgan('common'));

app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  next();
});

app.use('/resources', resourceRouter)


let server;

const runServer = (databaseUrl=DATABASE_URL, port=PORT) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {

            if (err) {
                return reject(err);
            }

            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })

            .on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

const closeServer = () => {
    return mongoose.disconnect().then(() => {

        return new Promise((resolve, reject) => {

            console.log('Closing server');
            server.close(err => {

                if (err) {
                    return reject(err);
                }

            resolve();
            });
        });
    });
}


if (require.main === module) {
  runServer().catch(err => console.error(err));
};
module.exports = {app, runServer, closeServer};
