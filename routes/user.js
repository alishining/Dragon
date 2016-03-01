var express = require('express');
var router = express.Router();

var result = {
	header : {
				 code : "200",
				 msg  : "成功"
			 },
	data : {
		   }
}

exports.hello = function(req, res, next){
	result.header.code = "200";
	result.header.msg  = "Success";
	result.data        = {};
	res.json(result);
};
