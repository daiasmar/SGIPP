const express = require('express');
const {urlencoded} = require('body-parser');

const server = express();

server.use(urlencoded({extended:true}));
server.use('/prueba', express.static('prueba'));

server.post('/nuevo-producto', (req, res) => {
    res.send(req.body);
});

server.listen(4000);