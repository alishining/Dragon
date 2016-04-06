var express = require('express');
var router = express.Router();
var sql = require('../dao/sql_tool');
var sql_mapping = require('../dao/sql_mapping');

var result = {
	header : {
				 code : "200",
				 msg  : "成功"
			 },
	data : {
		   }
}

exports.test = function(req, res, next){
	var income_account = 'in';
	var pay_account = 'out';
	var money = 5;
	var values = [income_account];
	sql.query(req, res, sql_mapping.update_balance, values, next, function(err, ret){
		values = [];
		sql.query(req, res, sql_mapping.update_balance, values, next, function(err, ret){
			result.header.code = "200";
			result.header.msg  = "Success";
			result.data        = {};
			res.json(result);
		});
	});
};
