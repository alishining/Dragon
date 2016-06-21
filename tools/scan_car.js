var http = require('http');
var constant = require('./constant');
var sql = require('../dao/sql_tool');
var sql_mapping = require('../dao/sql_mapping');
var request = require('request');
var fs = require('fs');


exports.scan_car = function(req, res, next, result, uid, pic_url, time, adcode, loc, tag, text, filePath, fileSize) {
	var r = request.post(constant.SB_PATH, function(error, response, body) {
		if (!error && response.statusCode == 200) {
			var body = JSON.parse(response.body);
			if (body.message.status == 0){
				var car_num = body.cardsinfo[0].items[0].content;
			} else {
				var car_num = '';
			}
			var values = [car_num];
			sql.query(req, res, sql_mapping.get_car_owner, values, next, function(err, ret){
				var car_owner = -1;
				if (ret != undefined){
					car_owner = ret[0].uid;
				}
				values = [uid, pic_url, time, adcode, loc, car_owner, car_num, '', '', 0, 0, tag, text, 0];
				sql.query(req, res, sql_mapping.upload_img, values, next, function(err, ret){
					result.header.code = '200';
					result.header.msg  = constant.SUCCESS;
					result.data        = {result : '0',
										  msg    : constant.UPLOAD_SUCCESS};
					res.json(result);
				});
			});
		}
		});
	var form = r.form();
	form.append('typeId', 19);
	form.append('key', constant.SB_KEY);
	form.append('secret', constant.SB_SECRET);
	form.append('format', 'json');
	form.append('file', fs.createReadStream(filePath));
}
