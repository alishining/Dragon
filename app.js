var express = require('express');
var multipart = require('connect-multiparty');
var http = require('http');
var ejs = require('ejs');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var user_route = require('./routes/user');

var app = express();

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With");
	res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
	res.header("X-Powered-By",' 3.2.1')
	res.header("Content-Type", "application/json;charset=utf-8");
	next();
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/send_message', user_route.send_message);
app.post('/login', user_route.login);
app.post('/image_list_by_time', user_route.image_list_by_time);
app.post('/image_list_by_fav', user_route.image_list_by_fav);
app.post('/image_list_by_search', user_route.image_list_by_search);
app.post('/image_list_by_me', user_route.image_list_by_me);
app.post('/image_list_by_mycar', user_route.image_list_by_mycar);

app.post('/click_like', user_route.click_like);
var multipartMiddleware = multipart();
app.post('/upload_image', multipartMiddleware, user_route.upload_image);
app.post('/bind_car', user_route.bind_car);
app.post('/logout', user_route.logout);

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		console.log(err.message);
	});
}

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	console.log(err.message);
});

var server = http.createServer(app);
server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
}).on('error', function(err){
	console.log("SERVER ERROR:", err);
});;
