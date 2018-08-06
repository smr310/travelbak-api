'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost:27017/travelBak';
exports.PORT = process.env.PORT || 8080;

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000'

exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

exports.JWT_SECRET = process.env.JWT_SECRET || 'secretString'

exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://dbuser1:dbpw12@ds111492.mlab.com:11492/travelbak_test'