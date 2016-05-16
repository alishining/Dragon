var express = require('express');
var sql = require('../dao/sql_tool');
var sql_mapping = require('../dao/sql_mapping');
var constant = require('../tools/constant');
var tools = require('../tools/sms');

var result = {
	header : {
				 code : 200,
				 msg  : constant.SUCCESS
			 },
	data   : {
		     }
}

exports.send_message = function(req, res, next){ 
	var phone = req.body.phone; 
	var random_code = Math.floor(Math.random()*10000); 
	if (random_code < 10){ 
		random_code = '000' + random_code; 
	} else { 
		if (random_code < 100){ 
			random_code = '00' + random_code; 
		} else { 
			if (random_code < 1000) 
				random_code = '0' + random_code;
		} 
	} 
	var nick = constant.USER + phone.substring(7);
	if (tools.sms(random_code, phone, 1)){ 
		var values = [phone];
		sql.query(req, res, sql_mapping.check_user, values, next, function(err, ret){
			if (ret.length == 0){
				values = [random_code, nick, phone, ''];
				sql.query(req, res, sql_mapping.insert_user, values, next, function(err, ret){
					result.header.code = 200; 
					result.header.msg  = constant.SUCCESS; 
					result.data        = {result : 0, msg : constant.SUCCESS, code : random_code}; 
					res.json(result); 
				})
			} else {
				values = [random_code, phone];
				sql.query(req, res, sql_mapping.update_pwd, values, next, function(err, ret){
					result.header.code = 200; 
					result.header.msg  = constant.SUCCESS; 
					result.data        = {result : 0, msg : constant.SUCCESS, random_code};
					res.json(result); 
				})
			}
		})
	} else { 
		result.header.code = 500; 
		result.header.msg  = constant.FAILED; 
		result.data        = {}; 
		res.json(result); 
	} 
}

exports.login = function(req, res, next){ 
	var phone = req.body.phone; 
	var password = req.body.password;
	if (phone == undefined || password == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.check_user, values, next, function(err, ret){ 
		if (ret.length == 0){
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS;
			result.data        = {result : -1, msg : constant.USER_NOT_EXISTS};
			res.json(result);
			return;
		}
		if (ret[0].password == password){
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : ret[0].uid}; 
			res.json(result); 
		} else { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;
			result.data = {result : -1, msg : constant.PASSWORD_ERROR}; 
			res.json(result); 
		} 
	}) 
} 

exports.get_image_list = function(req, res, next){ 
	var adcode = req.body.adcode;
	var page = req.body.page;
	var type = req.body.type;
	var uid = req.body.uid;
	var car_num = req.body.car_num;
	if (adcode == undefined || page == undefined || type == undefined || uid == undefined || car_num == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = []; 
	if (uid != ''){
		values = [];
		sql.query(req, res, sql_mapping.search_uid_image, values, next, function(err, ret){ 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {pic_list : ret}; 
			res.json(result); 
		}) 
	} else if (car_num != ''){
		values = [];
		sql.query(req, res, sql_mapping.search_car_image, values, next, function(err, ret){ 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {pic_list : ret};    
			res.json(result); 
		}) 
	} else {
		sql.query(req, res, sql_mapping.scan_image, values, next, function(err, ret){ 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {pic_list : ret}; 
			res.json(result); 
		}) 
	}
} 

exports.image_detail = function(req, res, next){ 
	var phone = req.body.phone; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.login, values, next, function(err, ret){ 
		try { 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} catch(err) { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} 
	}) 
} 

exports.click_like = function(req, res, next){ 
	var phone = req.body.phone; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.login, values, next, function(err, ret){ 
		try { 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} catch(err) { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} 
	}) 
} 

exports.submit_comment = function(req, res, next){ 
	var phone = req.body.phone; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.login, values, next, function(err, ret){ 
		try { 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} catch(err) { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} 
	}) 
} 

exports.ranking = function(req, res, next){ 
	var phone = req.body.phone; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.login, values, next, function(err, ret){ 
		try { 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} catch(err) { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} 
	}) 
} 

exports.upload_image = function(req, res, next){ 
	var phone = req.body.phone; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.login, values, next, function(err, ret){ 
		try { 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} catch(err) { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} 
	}) 
} 

exports.bind_car = function(req, res, next){ 
	var phone = req.body.phone; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.login, values, next, function(err, ret){ 
		try { 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} catch(err) { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} 
	}) 
} 

exports.search_image = function(req, res, next){ 
	var phone = req.body.phone; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.login, values, next, function(err, ret){ 
		try { 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} catch(err) { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} 
	}) 
} 

exports.me = function(req, res, next){ 
	var phone = req.body.phone; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.login, values, next, function(err, ret){ 
		try { 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} catch(err) { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} 
	}) 
} 

exports.logout = function(req, res, next){ 
	var phone = req.body.phone; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [phone]; 
	sql.query(req, res, sql_mapping.login, values, next, function(err, ret){ 
		try { 
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} catch(err) { 
			result.header.code = 200;
			result.header.msg  = constant.SUCCESS;; 
			result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
			res.json(result); 
		} 
	}) 
} 

