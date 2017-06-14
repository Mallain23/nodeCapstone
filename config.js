exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                      'mongodb://mallain23:afrojack22@ds125262.mlab.com:25262/resources';
exports.PORT = process.env.PORT || 8080;

exports.TEST_DATABASE_URL = 'mongodb://mallain23:afrojack22@ds163721.mlab.com:63721/blogdata'
