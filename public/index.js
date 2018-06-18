var client = require('socket.io-client');
let sock = client.connect(
  'http://localhost:3000',
  {
    reconnect: false
  }
);
/////Messenger
const onMessage = text => {
  let list = document.getElementById('chat');
  let el = document.createElement('li');
  el.innerHTML = text;
  list.appendChild(el);
  // console.log('I have made a 2 way connection with the server!');
};

let form = document.getElementById('chat-form');
form.addEventListener('submit', function(e) {
  let input = document.getElementById('chat-input');
  let value = input.value;
  input.value = '';
  sock.emit('msg', value);
  e.preventDefault();
});

sock.on('msg', onMessage);
/////// Single player Game
let score = 0;

let player2Score = 0
let player1Score = 0

sock.on('p2CurrScore', num => {
  player2Score = num
})

sock.on('p1CurrScore', num => {
  player1Score = num
})

let datHole = document.getElementsByClassName('hole');
let spriteArr = [
  'mole',
  'bomb',
  'mole',
  'bomb',
  'lucky',
  'mole',
  'mole',
  'mole',
  'mole',
  'mole'
];

setInterval(() => {
  // const arrHole = Array.from(datHole);
  const currHole = Math.round(Math.random() * (datHole.length - 1));
  const randomSprite = Math.round(Math.random() * (spriteArr.length - 1));

  datHole[currHole].classList.toggle(spriteArr[randomSprite]);
}, 300);

////these score adjustments below need to be send to scoreboard on newGame
document.getElementById('whack-a-mole').addEventListener('click', event => {
  if (event.target.matches('.mole')) {
    // score++;
    event.target.classList.remove('mole');
    event.target.classList.toggle('poof');
    sock.emit('scoreUpdate', {
      playerId: sock.id,
      num: 1
    });

    setTimeout(() => {
      event.target.classList.remove('poof');
    }, 300);
  }

  if (event.target.matches('.bomb')) {
    // score -= 10;
    event.target.classList.remove('bomb');
    event.target.classList.toggle('poof');
    sock.emit('scoreUpdate', {
      playerId: sock.id,
      num: -10
    })
    setTimeout(() => {
      event.target.classList.remove('poof');
    }, 300);
  }

  if (event.target.matches('.lucky')) {
    // score += 5;
    event.target.classList.remove('lucky');
    event.target.classList.toggle('poof');
    sock.emit('scoreUpdate', {
      playerId: sock.id,
      num: 5
    })
    setTimeout(() => {
      event.target.classList.remove('poof');
    }, 300);
  }

  document.getElementById('p1Score').textContent = player1Score;
  document.getElementById('p2Score').textContent = player2Score;
});
