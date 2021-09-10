const express = require("express");
const app = require('express')();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Config 
app.set("views", "./views");
app.set("view engine", "ejs");


// Lista de productos
const productos = [
    {
        id: 1,
        title: 'Neymar',
        price: 165,
        thumbnail: 'neymar.jpg'
    }
]; 

// Lista de mensajes

const messages = [
    {
        email: 'cristian.svk@gmail.com',
        timestamp: '01/01/2021 12:12:22',
        message: 'Hola!'
    }
]

// Rutas

app.get('/', (req, res) => {
    res.render('pages/index', {productos: productos})
})

// Connection Socket.io

io.on('connection', (socket) => {
    socket.broadcast.emit('mensaje-user', 'Hola mundo');

    // emit
    socket.emit('products', productos);
    socket.emit('messages', messages);

    // products
    socket.on('new-product', function(data){
        let myID = (productos.length)+1;

        let myTitle = data.title;
        let myPrice = data.price;
        let myThumbnail = data.thumbnail;

        const producto = {
            id: myID, 
            title: myTitle, 
            price: myPrice, 
            thumbnail: myThumbnail
        }

        productos.push(producto);

        io.sockets.emit('products', productos);
    })

    // message-center

    socket.on('new-message', function(data) {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });

})

http.listen(3024, () => {
    console.log('Driving-driving on port 3024');
})