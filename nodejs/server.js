#!/usr/bin/env node

const express = require('express'); // web server with routing supports
var app = express();
var server = require('http').Server(app); // http server itself with express as an app
const path = require('path');

var zmq = require('zeromq')
const WSS = require('ws').Server;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // use ./public as web directory

const WEB_LISTENING_PORT = 3000;
server.listen(WEB_LISTENING_PORT);

console.log("Web server listening on port " + WEB_LISTENING_PORT);

var wss = new WSS({ server: server,
					path: "/websocket_example"}
				 );

// Now using new API for ZMQ pull
async function run() {
  const sock = new zmq.Pull

  sock.connect("tcp://10.52.72.7:54026")
  console.log("Worker connected to port 54026")

  for await (const [msg] of sock) {
    //  console.log("work: %s", msg.toString())
    wss.clients.forEach(function each(client) {
		client.send(msg.toString());
	});
  }
}

run()
