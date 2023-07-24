'use strict';

const _ = require('lodash');
const { Types } = require('mongoose');
const converToObjectInMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};
// ['a', 'b'] => {a: 1, b: 1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// ['a', 'b'] => {a: 0, b: 0} => no se khong lay ra
// const unGetSelectData = (unSelect = []) => {
//   return Object.fromEntries(unSelect.map((el) => [el, 1]));
// };

const unGetSelectData = (unSelect = []) => {
  const projection = {};

  unSelect.forEach((field) => {
    projection[field] = 0;
  });

  return projection;
};

//loai bo nhung than so null or undefined when client transmit data
const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  });
  return obj;
};

/* 
db: {
	a: 1,
    b: {
        c: 2,
        d: 3,
    },	
}

db.collection.updateOne({
	`b.c`: 2,
	`b.d`: 3,
})

if front end remove b.d => backend:

db: {
	a: 1,
    b: {
        c: 2,

    },	
}

db.collection.updateOne({
	`b.c`: 2,

})
obj[key] !== null && typeof obj[key] === 'object'
*/

/* 
 - neu frontend update thieu data thi phi backend tu dong loai bo gia tri null va undefined ra roi moi update data
 - vidu co ba gia tri trong attributed ma update mot gia tri thoi, phia frontend patch 1 date, giong ex phia tren
 - function above filtering attribute has undefined and null value

*/
const updateNestedObjectPraser = (obj) => {
  // console.log(`[1]:::`, obj);
  const final = {};
  Object.keys(obj).forEach((key) => {
    // console.log(`[2]:::`, key);
    // console.log(`[3]:::`, typeof obj[key]);
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      // console.log(`obj[key]:::`, obj[key]);
      const response = updateNestedObjectPraser(obj[key]);
      Object.keys(response).forEach((a) => {
        // console.log(`[4]:::`, a);
        if (response[a] !== null && response[a] !== undefined) {
          final[`${key}.${a}`] = response[a];
        }
      });
    } else {
      if (obj[key] !== null && obj[key] !== undefined) {
        final[key] = obj[key];
      }

      // final[key] = obj[key];
    }
  });

  // console.log(`[5]:::`, final);
  return final;
};

module.exports = {
  getInfoData,
  getSelectData,
  unGetSelectData,
  removeUndefinedObject,
  updateNestedObjectPraser,
  converToObjectInMongodb,
};
