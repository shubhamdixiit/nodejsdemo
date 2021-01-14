var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/config.json');

var S = require('string');

/* Global authentication JWT */
function authenticateRequest(req, res, next) {

	req.body.pageId = (req.body.pageId) ? req.body.pageId : '';
	var pageId = req.body.pageId.split("--");
	req.body.pageId = pageId[0];
	console.log("come here");
	next();

	/*let token = (req.headers['authorizationcode'])?req.headers['authorizationcode']:req.headers['authorization'];
	console.log('----Route JS----' + token);
	var tokenString = S(token);
	var lastChar = tokenString.substr(tokenString.length - 1, tokenString.length - 1);
	if(lastChar == ',') {
		token = tokenString.substr(0, tokenString.length - 1);	
		token = token.s;
	}
	jwt.verify(token, config.secret, { complete: true }, function (err, decoded) {		
		if (err) {
			//console.log(err);
			res.send({ 'msg': 'Unauthorised Access', 'success': 0, 'data': {}, 'totalRecord': 0 });
		} else {
			req.decoded = decoded;
			next();
		}
	});*/
	
}

function authenticateSecurityToken(req, res, next) {
	var token = jwt.sign({ token: config.encodeToken }, config.secret);
	if (token) {
		res.send(token);
	} else {
		next();
	}	
}

router.get('/auth-security-token', function (req, res) {
	var token = jwt.sign({ token: config.encodeToken }, config.secret);
	var jsonObj = { 'key' : token };
	res.send(jsonObj);
});
/* Global authentication JWT End */

/* Handle middleware */
 
router.use('/attribute/', authenticateRequest, require('../controller/attribute.controller'));
 
module.exports = router;
