'use strict';

const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
  node: 'https://localhost:9200',
});

//check connect
client.ping(
  {
    requestTimeout: 3000, //ms
  },
  (err, res, sta) => {
    if (err) {
      return console.log(`Error connect:::`, err);
    }
    console.log(`Connect elasticsearch success::::`);
  }
);

module.exports = client;
