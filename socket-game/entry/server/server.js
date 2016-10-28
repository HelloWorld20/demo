/*
前端用socket.emit,后台用socket.broadcast.emit可以实现广播
前端用socket.emit,后台用io.emit可以实现向所有用户推送
前端用socket.emit,后台用socket.emit可以实现只返回给发起者。
 */



var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3001;

function start() {
	app.get('/', function (req, res) {
	  res.sendfile(__dirname + '/index.html');
	});

	io.on('connect', function(socket) {
		console.log('connected...');

		socket.on('position', function(msg) {
			socket.broadcast.emit('setPos', msg);
		})

		socket.on('draw', function(msg) {
			socket.broadcast.emit('setPic', msg);
		})

	})

	http.listen(port, function(){
		console.log('listening on *:' + port);
	});
}



module.exports.start = start;