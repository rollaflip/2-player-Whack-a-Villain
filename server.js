'use strict';

const path = require('path');
const express = require('express');
const socketio = require('socket.io');
const Game = require('./server/game')

const app = express();

const server = app.listen(3000, function() {
  console.log(`Listening on http://localhost:${server.address().port}`);
});
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

let waitingPlayer = null


///Chat room

io.on('connection', socket => {
  console.log('a new client has connected: ' + socket.id);

  socket.on('disconnect', function(reason) {console.log(':( disconnected', reason)});
  
  if (waitingPlayer){
    //start game
    const newGame = new Game(waitingPlayer, socket)
    waitingPlayer = null
    

  } else {
    waitingPlayer = socket
    waitingPlayer.emit('msg', 'You are waiting for an opponent')
  }
  socket.on('msg', text => io.emit('msg', text));
});


server.on('error', err => {
  console.error('Server error:', err);
});
