// const socketio = require('socket.io');

var socket = io();

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
  socket.emit('msg', value);
  e.preventDefault();
  // onMessage(value);
});

sock.on('msg', onMessage);
/////// Single player Game
let score = 0;

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

document.getElementById('whack-a-mole').addEventListener('click', event => {
  if (event.target.matches('.mole')) {
    score++;
    event.target.classList.remove('mole');
    event.target.classList.toggle('poof');
    setTimeout(() => {
      event.target.classList.remove('poof');
    }, 300);
  }

  if (event.target.matches('.bomb')) {
    score -= 5;
    event.target.classList.remove('bomb');
    event.target.classList.toggle('poof');
    setTimeout(() => {
      event.target.classList.remove('poof');
    }, 300);
  }

  if (event.target.matches('.lucky')) {
    score += 5;
    event.target.classList.remove('lucky');
    event.target.classList.toggle('poof');
    setTimeout(() => {
      event.target.classList.remove('poof');
    }, 300);
  }

  document.getElementById('score').textContent = score;
});
