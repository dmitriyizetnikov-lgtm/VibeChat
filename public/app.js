const socket = io(); // Авто-подключение к текущему адресу

const authScreen = document.getElementById('auth-screen');
const chatScreen = document.getElementById('chat-screen');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

function login() {
    const username = document.getElementById('username').value;
    if (username.trim()) {
        socket.emit('register', username);
        authScreen.style.display = 'none';
        chatScreen.style.display = 'flex';
    }
}

sendBtn.onclick = () => {
    const msg = messageInput.value;
    if (msg) {
        socket.emit('chatMessage', msg);
        messageInput.value = '';
    }
};

socket.on('message', (data) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<strong>${data.user}:</strong> ${data.text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
});