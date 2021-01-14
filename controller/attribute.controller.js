var express = require('express');
var router = express.Router();
var async = require('async');
var config = require('../config/config.json');
var attributeMod = require('../model/attribute.model');
 
router.post('/create',   create);
router.post('/get-all',   getAttributeByIds);

module.exports = router;
 function create(req, res) {

	var req = (req.body) ? req.body : req;
	let tmpObj = { 'msg': '', 'success': 0, 'data': {}, 'totalRecord': 0, 'errorCode': 0 };

	//console.log('-----req---'); console.log(req);
 	var query = { 'date': req.date, 'witchtime': req.witchtime, 'timezone': req.timezone };
 	
 	//console.log(query);
	attributeMod.recordCount(query).then(function (__totalRecord) {

		if (__totalRecord < 1) {

			let newObjectId = require('mongoose').Types.ObjectId().toString();
			
      
			var query = {
				"_id": newObjectId,
				"date": req.date,
				"timezone": req.timezone,
				"timeduration": req.timeduration,
				"witchtime": req.witchtime
			};

 			attributeMod.create(query).then(function (__data) {
				tmpObj.msg = "Booking has been added successfully";
				tmpObj.data = __data;
				tmpObj.success = 1;
				res.send(tmpObj);
			})
				.catch(function (__err) {
					tmpObj.errorCode = 1;
					tmpObj.msg = __err.message;
					tmpObj.success = 0;
					res.send(tmpObj);
				})
		} else {
			tmpObj.errorCode = 1;
			tmpObj.msg = 'Attribute is already exists';
			res.send(tmpObj);
		}
	}).catch(function (__err) {
		tmpObj.errorCode = 1;
		tmpObj.msg = __err.message;
		res.send(tmpObj);
	});
}


/*
 * @ Desc: Delete attribute | Param: appId(required), pageId(required), id(required) etc	
 * @ Method: POST | Response: JSON data | Request: [var]
 */
function deleteAttribute(req, res) {
	var req = (req.body) ? req.body : req;
	//var tempObj response object and var query for mongo	
	let tmpObj = { 'msg': '', 'success': 0, 'data': [], 'totalRecord': 0 };
	if (req.ids.length > 0) {

		var query = {};
		var pullCond = { 'attributes': { '$in': req.ids } }
		categoryMod.updateUsingPull(query, pullCond)
			.then(function (__returnStatus) {
				var query = { 'appId': req.appId, 'pageId': req.pageId, storeId: req.storeId, '_id': { '$in': req.ids } };
				attributeMod.remove(query).then(function (__success) {
					tmpObj.msg = "Attribute has been delete successfully";
					tmpObj.success = 1;
					res.send(tmpObj);
				}).catch(function (__error) {
					tmpObj.msg = __error.message;
					res.send(tmpObj);
				});
			})
			.catch(function (__error) {
				tmpObj.msg = "Attribute has been delete successfully";
				tmpObj.success = 1;
				res.send(tmpObj);
			})

	} else {
		tmpObj.msg = "Attribute has been delete successfully";
		tmpObj.success = 1;
		res.send(tmpObj);
	}
}


/*
 * @ Desc: Get attribute by Ids | Param: appId(required), pageId(required), Ids(Array<required>)
 * @ Method: POST | Response: JSON data
 */
function getAttributeByIds(req, res) {

	var req = (req.body) ? req.body : req;
	//var tempObj response object and var query for mongo
	let tmpObj = { 'msg': '', 'success': 0, 'data': [], 'totalRecord': 0 };

	 
		var query = {
			date: req.date
		}
 		 ;
		//version issue
		//console.log(JSON.stringify(query));
		attributeMod.getAttributes(query).then(function (data) {
			var _data = data.map(function (item) {
				 
				return item
			});
			tmpObj.success = 1;
			tmpObj.msg = 'success';
			tmpObj.totalRecord = _data.length;
			tmpObj.data = _data;
			res.send(tmpObj);
		}).catch(function (err) {
			tmpObj.success = 0;
			tmpObj.msg = err.message;
			res.send(tmpObj);
		});
	 
}
