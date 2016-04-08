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

exports.payment = function(req, res, next){
	var income_account = req.body.income_account;
	var pay_account = req.body.pay_account;
	var money = req.body.money;
	if (income_account == undefined || pay_account == undefined || money == undefined){
		result.header.code = "400";
		result.header.msg  = "参数不存在";
		result.data        = {};
		res.json(result);
		return;
	}
	money = parseInt(money);
	if (isNaN(money)){
		result.header.code = "500";
		result.header.msg  = "金额异常";
		result.data        = {};  
		res.json(result);
		return;
	}
	var values = [income_account];
	sql.query(req, res, sql_mapping.get_balance, values, next, function(err, ret){
		var income_balance = parseInt(ret[0].balance);
		values = [pay_account];
		sql.query(req, res, sql_mapping.get_balance, values, next, function(err, ret){
			var pay_balance = parseInt(ret[0].balance);
			pay_balance = pay_balance - money;
			income_balance = income_balance + money;
			values = [income_balance, income_account];
			sql.query(req, res, sql_mapping.update_balance, values, next, function(err, ret){
				values = [pay_account, pay_balance];
				sql.query(req, res, sql_mapping.update_balance, values, next, function(err, ret){
					result.header.code = "200";
					result.header.msg  = "Success";
					result.data        = {};
					res.json(result);
				});
			});
		});
	});
}



