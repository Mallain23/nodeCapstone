
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const studyResourceSchema = mongoose.Schema({

      title: {type: String, required: true},
      typeOfResource: {type: String, required: true},
      author:  String,
      course: {type: String, required: true},
      content: {type: String, required: true},
      publishedOn: Date

})

studyResourceSchema.methods.apiRpr = function () {
    return {
      id: this.id,
      title: this.title,
      typeOfResource: this.typeOfResource,
      content: this.content,
      course: this.course,
      publishedOn: this.publishedOn,
      author: this.author
    }
}

const UserSchema = mongoose.Schema({

  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ""},
  lastName: {type: String, default: ""},
  myResources: [{
                        title:  String,
                        course: String,
                        content: String,
                        typeOfResource: String,
                        resourceId: String,
                        author: String,
                        publishedOn: String
                    }],
  currentClasses: [{
                courseName: String,
                resources: [{
                  title:  String,
                  course: String,
                  content: String,
                  typeOfResource: String,
                  resourceId: String,
                  author: String,
                  publishedOn: String
                }]
              }]
});

UserSchema.methods.apiRpr = function() {
    return {
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        currentClasses: this.currentClasses || '',
        myResources: this.myResources || ''
    };
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = password => {
    return bcrypt.hash(password, 10);
}

const StudyResources = mongoose.model('StudyResources', studyResourceSchema);
const Users = mongoose.model('Users', UserSchema)

module.exports = {StudyResources, Users};
