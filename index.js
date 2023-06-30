const express = require('express');
const {urlencoded} = require('body-parser');
const session = require('express-session');

const server = express();

server.use(urlencoded({extended:true}));

server.post('/nuevo-producto', (req, res) => {
    res.send(req.body);
});

server.listen(4000);