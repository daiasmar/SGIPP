const express = require('express');
const {urlencoded} = require('body-parser');
const session = require('express-session');

let usuarios = [
    { usuario : 'Daiana', contraseña : 'root' },
    { usuario : 'Evaluador', contraseña : '1234' },
    { usuario : 'Trambolico', contraseña : 'SubiryBajar' }
]

const server = express();

server.use(session({
    secret : '1234',
    resave : true,
    saveUninitialized : false
}));

server.use(urlencoded({extended:true}));


server.use('/login', express.static('login'));
server.use('/', express.static('prueba'));

server.get('/', (req, res) => {
    if(req.session.usuarios){
        return res.send('holi');
    }
    res.redirect('/login');
})

server.post('/nuevo-producto', (req, res) => {
    res.send(req.body);
});

server.listen(4000);