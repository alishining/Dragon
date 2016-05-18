var express = require('express');
var qiniu = require('qiniu');
var fs = require('fs');
var sql = require('../dao/sql_tool');
var sql_mapping = require('../dao/sql_mapping');
var constant = require('../tools/constant');
var tools = require('../tools/sms');
var scan = require('../tools/scan_car');

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
	var start = page * constant.PAGE_SIZE - constant.PAGE_SIZE;
	var end   = start + constant.PAGE_SIZE;
	var values = []; 
	if (uid != ''){
		values = [];
		sql.query(req, res, sql_mapping.search_uid_image, values, next, function(err, ret){ 
			var pic_list = [];
			for (var i=start;i<end;i++){
				if (ret[i] != undefined)
					pic_list.push(ret[i]);
			}
			var next = 1;
			if (pic_list.length != constant.PAGE_SIZE)
				next = 0;
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {pic_list : pic_list, next : next}; 
			res.json(result); 
		}) 
	} else if (car_num != ''){
		values = [];
		sql.query(req, res, sql_mapping.search_car_image, values, next, function(err, ret){ 
			var pic_list = [];
			for (var i=start;i<end;i++){
				if (ret[i] != undefined)
					pic_list.push(ret[i]);
			}
			var next = 1;
			if (pic_list.length != constant.PAGE_SIZE)
				next = 0;
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {pic_list : pic_list, next : next};    
			res.json(result); 
		}) 
	} else {
		sql.query(req, res, sql_mapping.scan_image, values, next, function(err, ret){ 
			var pic_list = [];
			for (var i=start;i<end;i++){
				if (ret[i] != undefined)
					pic_list.push(ret[i]);
			}
			var next = 1;
			if (pic_list.length != constant.PAGE_SIZE)
				next = 0;
			result.header.code = 200; 
			result.header.msg  = constant.SUCCESS; 
			result.data = {pic_list : pic_list, next : next}; 
			res.json(result); 
		}) 
	}
} 

exports.image_detail = function(req, res, next){ 
	var pid = req.body.pid; 
	if (pid == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [pid]; 
	sql.query(req, res, sql_mapping.image_detail, values, next, function(err, ret){ 
		var comment_list = [];
		for (var i=0;i<ret.length;i++){
			comment_list.push(ret[i].content);
		}
		result.header.code = 200; 
		result.header.msg  = constant.SUCCESS; 
		result.data = {}; 
		res.json(result); 
	}) 
} 

exports.click_like = function(req, res, next){ 
	var pid = req.body.pid; 
	if (phone == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [pid]; 
	sql.query(req, res, sql_mapping.click_like, values, next, function(err, ret){ 
		result.header.code = 200; 
		result.header.msg  = constant.SUCCESS; 
		result.data = {result : 0, msg : constant.SUCCESS}; 
		res.json(result); 
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
	var tmp_filename = req.files.file.path;
	var detail = req.body.detail;
	var loc = req.body.loc;
	var type = req.body.type;
	var uid = req.body.uid; 
	var ds = req.body.ds;
	var adcode = req.body.adcode;
	var tag = req.body.tag;
	var fav = req.body.fav;
	if (uid == undefined || type == undefined || loc == undefined || ds == undefined || detail == undefined || fav == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var date  = new Date();
	var key = uid + date.getTime() + '.jpg';
	var extra = new qiniu.io.PutExtra();
	var putPolicy = new qiniu.rs.PutPolicy('wzppp');
	var uptoken = putPolicy.token();
	qiniu.io.putFile(uptoken, key, tmp_filename, extra, function(err, ret) {
		if (!err) {
			var pic_url = constant.QINIU_PATH + key;
			scan.scan_car(req, res, next, result, uid, pic_url, ds, adcode, loc, tag, detail, fav, tmp_filename, req.files.file.size);
		} else {
			result.header.code = '200';
			result.header.msg  = constant.SUCCESS;
			result.data        = {result : '-1',
								  msg    : constant.UPLOAD_SUCCESS ,
								  err    : err};
			res.json(result);
		}
	});
} 

exports.bind_car = function(req, res, next){ 
	var phone = req.body.phone; 
	var car_num = req.body.car_num;
	if (phone == undefined || car_num == undefined){ 
		result.header.code = 400; 
		result.header.msg  = constant.NO_PARAM; 
		result.data        = {}; 
		res.json(result); 
		return; 
	} 
	var values = [car_num, phone]; 
	sql.query(req, res, sql_mapping.bind_car, values, next, function(err, ret){ 
		result.header.code = 200; 
		result.header.msg  = constant.SUCCESS; 
		result.data = {result : 0, uid : phone, msg : constant.SUCCESS}; 
		res.json(result); 
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
	result.header.code = 200; 
	result.header.msg  = constant.SUCCESS; 
	result.data = {result : 0, msg : constant.SUCCESS}; 
	res.json(result); 
} 

