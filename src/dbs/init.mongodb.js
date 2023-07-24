'use strict';

const mongoose = require('mongoose');
const config = require('../config/config');
// const {
//   db: { host, port, name },
// } = require('../config/mongodb');
mongoose.set('strictQuery', false);
// const connectString = `mongodb://${host}:${port}/${name}`;
// const connectString = 'mongodb+srv://johnsmith2001it:twFDF2QLX9uQ5fbt@cluster0.troet70.mongodb.net/EcommerceBE';
const connectString = config.mongoose.url;
console.log(connectString);
//lam sao de xac dinhj luong so luong user ket no mongo

class Database {
  constructor() {
    this.connect();
  }

  //connect

  connect(type = 'mongodb') {
    if (1 === 1) {
      mongoose.set('debug', true);
      mongoose.set('debug', { color: true });
    }

    mongoose
      .connect(connectString, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
      .then((_) => {
        console.log(`Connect mongoose success::::`);
      })
      .catch((err) => console.log(`error connect`, err));
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb;
