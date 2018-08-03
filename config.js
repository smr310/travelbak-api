'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/travelBak';
exports.PORT = process.env.PORT || 8080;
exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000'

exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';


exports.JWT_SECRET = process.env.JWT_SECRET;
// exports.JWT_SECRET = "secretString"

// exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://dbuser1:dbpw1@ds133570.mlab.com:33570/node_cap_db_test';