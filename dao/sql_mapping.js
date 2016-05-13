
var sql = {
	check_user : 'select * from user where phone=?',
	insert_user : 'insert into user(password, nick, phone, car_list) values(?,?,?,?)',
	update_pwd : 'update user set password=? where phone=?'
};

module.exports = sql;
