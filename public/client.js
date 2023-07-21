// public/client.js
const socket = io();

let name;
let textarea = document.querySelector('#textarea');
let messageArea = document.querySelector('.message__area');

do {
  name = prompt('Please enter your name: ');
} while (!name);

// Fetch existing messages from the server and display them
socket.on('message', (msg) => {
  appendMessage(msg, msg.user === name ? 'outgoing' : 'incoming');
});

textarea.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    sendMessage(e.target.value);
  }
});

function sendMessage(message) {
  let msg = {
    user: name,
    message: message.trim(),
  };
  // Append locally
  appendMessage(msg, 'outgoing');
  textarea.value = '';
  scrollToBottom();

  // Send to server
  socket.emit('message', msg);
}
let lastMessage = null;
function appendMessage(msg, type) {
    if (
        lastMessage &&
        lastMessage.user === msg.user &&
        lastMessage.message === msg.message
      ) {
        return; // Skip appending the message since it's a duplicate
      }
    
      lastMessage = msg;

  let mainDiv = document.createElement('div');
  let className = type;
  mainDiv.classList.add(className, 'message');

  let markup = `
    <h4>${msg.user}</h4>
    <p>${msg.message}</p>
  `;
  mainDiv.innerHTML = markup;
  messageArea.appendChild(mainDiv);
  scrollToBottom()
}

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}
