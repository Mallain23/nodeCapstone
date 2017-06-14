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

const StudyResources = mongoose.model('StudyResources', studyResourceSchema);

module.exports = {StudyResources};
