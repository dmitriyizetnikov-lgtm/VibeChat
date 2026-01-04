const socket = io();
let myName = "";

function login() {
    myName = document.getElementById('username').value;
    if (myName.trim()) {
        socket.emit('register', myName);
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('chat-screen').style.display = 'flex';
    }
}

function addFriend() {
    const name = document.getElementById('friend-input').value;
    if (name) {
        socket.emit('addFriend', name);
        document.getElementById('friend-input').value = '';
    }
}

socket.on('friendAdded', (name) => {
    const div = document.createElement('div');
    div.className = 'friend-item';
    div.innerText = `👤 ${name}`;
    document.getElementById('friends-list').appendChild(div);
});

socket.on('errorMsg', (msg) => alert(msg));

// Отправка сообщений (как было)
document.getElementById('send-btn').onclick = () => {
    const msg = document.getElementById('message-input').value;
    if (msg) {
        socket.emit('chatMessage', msg);
        document.getElementById('message-input').value = '';
    }
};

socket.on('message', (data) => {
    const div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<strong>${data.user}</strong>${data.text}`;
    document.getElementById('messages').appendChild(div);
});
