const express = require('express'); // web server with routing supports
const path = require('path');
const events = require('events');

const WEB_LISTENING_PORT = 3000;
const WS_URL = 'ws://waterfall_backend:8000/websocket'

var app = express();
var server = require('http').Server(app); // http server itself with express as an app
var io = require('socket.io')(server); // easy to use wrapping for Websocket
var logger = require('morgan'); // log for express
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // use ./public as web directory

server.listen(WEB_LISTENING_PORT);
console.log("Web server listening on port " + WEB_LISTENING_PORT);

var main_events_loop = new events.EventEmitter();

// events
const EVENT_BROWSER_DISCONNECT 	= "browser_disconnect"
const EVENT_BROWSER_CONNECT 	= "browser_connect"
const EVENT_BROWSER_MESSAGE 	= "browser_message"
const EVENT_WS_DATA 			= "ws_data"

main_events_loop.on("event", function(event){

	if (event && event.type)
	{
		switch(event.type)
		{

			case EVENT_BROWSER_DISCONNECT:
			console.log("Browser " + event.data.id + " just disconnected")
			break
			case EVENT_BROWSER_CONNECT:
			console.log("Browser " + event.data.id + " just connected")
			break 

			case EVENT_BROWSER_MESSAGE:
			console.log("Browser " + event.data.id + " just sent " + event.data.payload)
			break

			default:

		}

	}

})

io.on('connection', function (socket) {

  main_events_loop.emit("event",{"type" : EVENT_BROWSER_CONNECT, "data" : { "id" : socket.id }})

  main_events_loop.on("data",function(data)
  {
  	socket.compress(true).emit("data",data)
  })

  socket.on('disconnect', function () {
  	main_events_loop.emit("event",{"type" : EVENT_BROWSER_DISCONNECT, "data" : { "id" : socket.id }})
  })

  socket.on('message', function (data) {
  	main_events_loop.emit("event",{"type" : EVENT_BROWSER_MESSAGE, "data" : { "id" : socket.id, "payload" : data }})
  })

})

var W3CWebSocket = require('websocket').w3cwebsocket;
 
var client = new W3CWebSocket(WS_URL);
var keepalive;
 
client.onerror = function() {
    console.log('Connection Error');
};
 
client.onopen = function() {
    console.log('WS Client Connected');

};
 
client.onclose = function() {
    console.log('WS Client Closed');
    client = new W3CWebSocket(WS_URL);
};


 
client.onmessage = function(evt) {

	clearTimeout(keepalive)

	console.log('WS Client Message');
	main_events_loop.emit("data",JSON.parse(evt.data))
  
	keepalive = setTimeout(function()
    {
            client.close();
    },1000,client)

};