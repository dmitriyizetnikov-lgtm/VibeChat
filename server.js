const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const users = {}; // { socketId: username }
const friends = {}; // { username: [list of friend names] }

io.on('connection', (socket) => {
    socket.on('register', (username) => {
        users[socket.id] = username;
        if (!friends[username]) friends[username] = [];
        socket.join('common'); // Все заходят в общий чат
        console.log(`${username} подключился`);
    });

    // Добавление в друзья
    socket.on('addFriend', (friendName) => {
        const myName = users[socket.id];
        if (friends[friendName] && myName !== friendName) {
            if (!friends[myName].includes(friendName)) {
                friends[myName].push(friendName);
                friends[friendName].push(myName);
                socket.emit('friendAdded', friendName);
                // Уведомляем друга, если он в сети
                socket.broadcast.emit('updateFriendList');
            }
        } else {
            socket.emit('errorMsg', 'Пользователь не найден или это вы');
        }
    });

    socket.on('chatMessage', (msg) => {
        io.to('common').emit('message', { user: users[socket.id], text: msg });
    });

    socket.on('disconnect', () => {
        delete users[socket.id];
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`Сервер VibeChat на порту ${PORT}`));
