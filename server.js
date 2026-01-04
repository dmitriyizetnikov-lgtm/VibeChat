const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// Хранилище пользователей в памяти
const users = {};

io.on('connection', (socket) => {
    console.log('Пользователь подключился');

    socket.on('register', (username) => {
        users[socket.id] = username;
        socket.broadcast.emit('message', {
            user: 'Система',
            text: `${username} ворвался в VibeChat!`
        });
    });

    socket.on('chatMessage', (msg) => {
        io.emit('message', { user: users[socket.id], text: msg });
    });

    socket.on('disconnect', () => {
        if (users[socket.id]) {
            io.emit('message', {
                user: 'Система',
                text: `${users[socket.id]} покинул чат.`
            });
            delete users[socket.id];
        }
    });
});

// Настройка порта для Render
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`VibeChat запущен на порту ${PORT}`);
});