
var sql = {
	check_user : 'select * from user where phone=?',
	insert_user : 'insert into user(password, nick, phone, car_list) values(?,?,?,?)',
	update_pwd : 'update user set password=? where phone=?',
	search_uid_image : 'SELECT * FROM image where uid=?',
	search_car_image : 'SELECT * FROM image where car_num=?',
	scan_image : 'SELECT * FROM image where type=? and adcode like ? and time like ?'
};

module.exports = sql;
