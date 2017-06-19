
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const studyResourceSchema = mongoose.Schema({

      title: {type: String, required: true},
      type: {type: String, required: true},
      username:  String,
      course: {type: String, required: true},
      professor: String,
      content: {type: String, required: true},
      popularity: Number,
      publishedOn: Date

})

studyResourceSchema.methods.apiRpr = function () {
    return {
      id: this.id,
      title: this.title,
      type: this.type,
      content: this.content,
      course: this.course,
      username: this.username
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
  currentClasses: [{
                courseName: String,
                resources: [{
                        title: String,
                        id: String,
                }]
  }],
  // savedResources: [{
  //                     title:  String,
  //                     id: String,
  //                     course: String
  //                   }],
  uploadedResources: [{
                        title:  String,
                        id: String,
                        course: String
                    }]

});

UserSchema.methods.apiRpr = function() {
    return {
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || '',
        currentClasses: this.currentClasses || '',
        savedResources: this.savedResources || '',
        uploadedResources: this.uploadedResources || ''
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
