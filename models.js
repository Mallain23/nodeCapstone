
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
  lastName: {type: String, default: ""}

});

UserSchema.methods.apiRpr = () => {
    return {
        username: this.username || '',
        firstName: this.firstName || '',
        lastName: this.lastName || ''
    };
}

UserSchema.methods.validatePassword = (password) => {
    return bcrypt.compare(password, this.password);
}

UserSchema.statics.hashPassword = (password) => {
    return bcrypt.hash(password, 10);
}

const StudyResources = mongoose.model('StudyResources', studyResourceSchema);
const Users = mongoose.model('Users', UserSchema)

module.exports = {StudyResources, Users};
