'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://dbuser:dbpw88@ds135421.mlab.com:35421/travelbak_db';
exports.PORT = process.env.PORT || 8080;

// exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://dbuser1:dbpw1@ds133570.mlab.com:33570/node_cap_db_test';