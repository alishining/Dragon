var mysql = require('mysql');

exports.mysql_pool = function(){
	return mysql.createPool({
				host : "",
				port : 3306,
				user : "",
				password : "",
				database : ""
		   });
}

