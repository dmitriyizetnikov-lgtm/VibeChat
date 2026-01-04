const socket = io();

function login() {
    const user = document.getElementById('username').value;
    if (user.trim()) {
        socket.emit('register', user);
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('chat-screen').style.display = 'flex';
    }
}

function addFriend() {
    const friendName = document.getElementById('friend-input').value;
    if (friendName) {
        socket.emit('addFriend', friendName);
        document.getElementById('friend-input').value = '';
    }
}

socket.on('friendAdded', (name) => {
    const list = document.getElementById('friends-list');
    const item = document.createElement('div');
    item.className = 'friend-item';
    item.innerText = `👤 ${name}`;
    list.appendChild(item);
});

socket.on('message', (data) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message';
    msgDiv.innerHTML = `<strong>${data.user}</strong>: ${data.text}`;
    document.getElementById('messages').appendChild(msgDiv);
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
});

document.getElementById('send-btn').onclick = () => {
    const input = document.getElementById('message-input');
    if (input.value) {
        socket.emit('chatMessage', input.value);
        input.value = '';
    }
};
