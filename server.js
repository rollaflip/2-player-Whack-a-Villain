'use strict';

const path = require('path');
const express = require('express');
const app = express();
const Game = require('./server/game')

const socketio = require('socket.io');

const server = app.listen(3000, function() {
  console.log(`Listening on http://localhost:${server.address().port}`);
});
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// const http = require('http');
// const express = require('express');
// const socketio = require('socket.io');
// const Game = require('./Server/game')
// const app = express();
// const clientPath = `${__dirname}/public`
// app.use(express.static(clientPath))
// const server = http.createServer(app)
// const io = socketio(server)
// server.listen(8080, () => {
//   console.log('RPS started on 8080');
// });

let waitingPlayer = null

///Chat room

let newGame;
io.on('connection', socket => {
  console.log('a new client has connected: ' + socket.id);
  
  socket.on('disconnect', function(reason) {console.log(':( disconnected', reason)});
  
  if (waitingPlayer){
    //start game
    newGame = new Game(waitingPlayer, socket)
    waitingPlayer = null
    // scorez = newGame.scoreBoard
    console.log(newGame.scoreBoard.p1Score)
    console.log('p1: ', newGame.players[0].id, 'p2: ', newGame.players[1].id)
    
    
  } else {
    waitingPlayer = socket
    waitingPlayer.emit('msg', 'You are waiting for an opponent')
  }

  socket.on('msg', text => io.emit('msg', text));
  
  socket.on('scoreUpdate', scoreVal => {
    let scoreAdj = (scr, val) => scr + val
    let p1BoardScore = newGame.scoreBoard.p1Score
    let p2BoardScore = newGame.scoreBoard.p2Score
  
    //if player 1 whacks
if (newGame.players[0].id === scoreVal.playerId) {
  newGame.scoreBoard.p1Score = scoreAdj(p1BoardScore, scoreVal.num)
  socket.emit('p1CurrScore', p1BoardScore)
} 
  //if player 2 whacks
if (newGame.players[1].id === scoreVal.playerId) {
  newGame.scoreBoard.p2Score = scoreAdj(p2BoardScore, scoreVal.num)
  socket.emit('p2CurrScore', p2BoardScore)
} 

    
    // console.log('this players id: ', newGame.players[1].id)
    console.log('whacker pID: ', scoreVal.playerId)
    console.log('p1: ', p1BoardScore, 'p2: ', p2BoardScore)
  })
});



server.on('error', err => {
  console.error('Server error:', err);
});
