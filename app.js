var
	fs = require("fs"),
	http = require('http'),
	path = require('path'),
	async = require('async'),
	socketio = require('socket.io'),
	express = require('express'),
	_ = require('lodash'),
	router = express(),
	bodyParser = require('body-parser'),
	server = http.createServer(router),
	io = socketio.listen(server),
	sockets = []
;

io.on('connection', function (socket) {
	sockets.push(socket);
	
	socket.on('disconnect', function () {
		sockets.splice(sockets.indexOf(socket), 1);
	});

	socket.on('dream', function (a) {
		console.log(a);
		if(a.name){
			socket.name = a.name;
		}
		if(a.to){
			sockets.forEach(function(sckt){
				if(
					sckt.name == a.to ||
					sckt.id == a.to
				){
					a.time = new Date();
					a.from = socket.name;
					sckt.emit('dream', a);
				}
			});
		}
	});
});

router.use(express.static(path.resolve(__dirname, 'www')));
server.listen(process.env.PORT || 1995, process.env.IP || "0.0.0.0", function(){
	console.log(
		server.address().address,
		server.address().port
	);
});
