const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Q = require("q");
var config = require('../config/config.json');
mongoose.set('useFindAndModify', false);

let ProductAttributeSchema = new Schema({
    "_id": { type: String },
    "date": { type: String },
    "timezone": { type: String },
    "timeduration": { type: String },
    "witchtime": { type: String },
    "addedon": { type: Number, default:  Math.floor(Date.now()/1000)},
    "updatedon": { type: Number, default:  Math.floor(Date.now()/1000)},
     
}, { timestamps: true });

 var attributeMod = mongoose.model('booktimeshlot', ProductAttributeSchema, 'booktimeshlot');

var helperMethod = {};

helperMethod.create = create;
helperMethod.update = update;
helperMethod.remove = remove;
helperMethod.getAttributes = getAttributes;
helperMethod.recordCount = recordCount;
helperMethod.updateMany  = updateMany;
helperMethod.updateManyAsync = updateManyAsync;
module.exports = helperMethod;

function create(query) {
    var deferred = Q.defer();
    attributeMod.create(query).then(function (_data) {
        deferred.resolve(_data);
    }).catch(function (_err) {
        deferred.reject(_err);
    });
    return deferred.promise;
}

function update(query, data) {
    var deferred = Q.defer();
    attributeMod.updateOne(query, { $set: data }).then(function (_data) {
        deferred.resolve(_data);
    }).catch(function (_err) {
        deferred.reject(_err);
    });

    return deferred.promise;
}

function updateManyAsync(__query,__data){ 
    var deferred = Q.defer();
    attributeMod.updateMany(__query, { '$set': __data })
    .then(function(__returnData){
       deferred.resolve(__returnData);
    })
    .catch(function(__error){
      deferred.reject(_err);
    });
    return deferred.promise;
}

function updateMany(__query,__data){ 
    attributeMod.updateMany(__query, { '$set': __data })
    .then(function(__returnData){
      return __returnData;
    })
    .catch(function(__error){
      return __error;
    });
}



function remove(query) {
    var deferred = Q.defer();
    attributeMod.deleteMany(query).then(function (_data) {
        deferred.resolve(_data);
    }).catch(function (_err) {
        deferred.reject(_err);
    });
    return deferred.promise;
}

function recordCount(query) {
    var deferred = Q.defer();
    attributeMod.countDocuments(query).then(function (count) {
        deferred.resolve(count);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
}

function getAttributes(query) {
    var deferred = Q.defer();
    attributeMod.find(query).then(function (_data) {
        deferred.resolve(_data);
    }).catch(function (err) {
        deferred.reject(err);
    });
    return deferred.promise;
}
