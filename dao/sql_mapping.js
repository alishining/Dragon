
var sql = {
	check_user : 'select * from user where phone=?',
	insert_user : 'insert into user(password, nick, phone, car_list) values(?,?,?,?)',
	update_pwd : 'update user set password=? where phone=?',
	search_uid_image : 'SELECT * FROM image where uid=?',
	search_car_image : 'SELECT * FROM image where car_num=?',
	scan_image : 'SELECT * FROM image where type like ? and adcode like ? and ds like ?',
	image_detail : 'select * from image a left outer join comment b on a.pid=b.pid where b.pid is not null',
	click_like : 'update image set fav=fav+1 where pid=?',
	bind_car : 'update user set car_list=? where phone=?',
	upload_img : 'insert into image(uid,pic_url,ds,adcode,location,car_num,car_brand,car_type,is_report,type,tag,detail,fav) values (?,?,?,?,?,?,?,?,?,?,?,?,?)'
};

module.exports = sql;
