class whackAMole {
  constructor(p1, p2) {
    this.players = [p1, p2];
    this.scoreBoard = {
        p1Score: 0,
        p2Score: 0
    }
    this.players.forEach(sock => sock.emit('msg', 'Game Starts!'))
    
    // this._sendToPlayers('Match Starts!')
    }

    _sendToPlayer(playerIndex, message){
        this._players[playerIndex].emit('msg', message)
    }

    _sendToPlayers(message){
    this.players.forEach(player => player.emit('msg', message ));
    }

    _checkGameOver(){
        if (this.scoreBoard.p1Score === 25){
            this.players.forEach(player => player.emit('msg', 'p1 Wins!' ));
        }
        if (this.scoreBoard.p2Score === 25){
            this.players.forEach(player => player.emit('msg', 'p2 Wins!' ));
        }
    }
}
module.exports = whackAMole;
