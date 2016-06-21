
var sql = {
	check_user : 'select * from user where phone=?',
	insert_user : 'insert into user(password, nick, phone, car_list) values(?,?,?,?)',
	update_pwd : 'update user set password=? where phone=?',
	search_car_image : 'SELECT * FROM image where car_num=?',
	image_list_by_me : 'SELECT * FROM image where uid=?',
	image_list_by_fav : 'SELECT * FROM image where adcode like ? order by ds desc, fav desc',
	image_list_by_time : 'SELECT * FROM image where adcode like ? order by pid desc',
	image_list_by_search : 'SELECT * FROM image where adcode like ? and (tag like ? or location like ? or car_num like ?) order by pid desc',
	image_list_by_mycar : 'select * from image where car_owner=?',
	image_detail : 'select * from image a left outer join comment b on a.pid=b.pid where b.pid is not null',
	click_like : 'update image set fav=fav+1 where pid=?',
	bind_car : 'update user set car_list=CONCAT(car_list, ?) where uid=?',
	upload_img : 'insert into image(uid,pic_url,ds,adcode,location,car_owner,car_num,car_brand,car_type,is_report,type,tag,detail,fav) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
	get_car_owner : 'select uid from user where car_list like ?'
};

module.exports = sql;
