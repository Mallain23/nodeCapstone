const express = require('express');

const mongoose = require('mongoose');

const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')

const passport = require('passport')
const session = require('express-session')



const {PORT, DATABASE_URL} = require('./config');
const {router: resourceRouter} = require('./routes/resourceRouter')
const {router: userRouter} = require('./routes/userRouter')
const {router: userDataRouter} = require('./routes/userDataRouter')
var path = require('path');


const app = express();

mongoose.Promise = global.Promise;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(morgan('common'));


app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  next();
});


app.use(session({secret: '755North755North755North'}))
app.use(passport.initialize());
app.use(passport.session())



const isLoggedIn = (req, res, next) => {

    if(req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
}


app.use('/users', userRouter)

app.use('/resources', resourceRouter)

app.use('/user-data', userDataRouter)

var path = require('path');


app.get('/', (req, res) => {
    console.log("path")
    console.log("here", req.user, req.isAuthenticated())
    if (req.isAuthenticated()) {

      res.redirect('/homepage')
      return
    }

  res.sendFile(__dirname + '/public/index1.html')
})

app.get('/homepage', isLoggedIn, function(req, res) {

   res.sendFile(path.join(__dirname + '/public/welcome.html'));
});

app.get('/logout', function (req, res) {

    req.session.destroy();
    res.json({message: "You have been loged out!"})
})

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
