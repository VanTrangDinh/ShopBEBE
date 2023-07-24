'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;
//count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connection :::${numConnection}`);
};
//check overload server => notify
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // thí dụ máy chiu được 5 connection của mongodb
    const maxConnections = numCores * 5;


    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
  
    }
  }, _SECONDS); // Mornitor every in 5s
};



module.exports = {
  countConnect,
  checkOverload,
};
