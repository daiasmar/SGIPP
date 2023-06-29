const express = require('express');

const server = express();

server.get('/',(req,res) => res.send('holi'));

server.listen(4000);