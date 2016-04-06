
var sql = {
	update_balance : 'update account set balance = ? where account = ?',
	get_balance : 'select * from account where account=?'
};

module.exports = sql;
