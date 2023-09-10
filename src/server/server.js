import { registerUser, authenticateUser, authenticateSession } from './auth.js'

import cookieParser from 'cookie-parser'
import express from 'express'
const app = express()

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded());
app.use(cookieParser());

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/templates/login.html')
})

app.post('/login', (req, res) => {
    
    try {
        const username = req.body.username
        const password = req.body.password

        if(authenticateUser(username, password)) {
            res.cookie('session', String(Math.random()), { maxAge: 900000, httpOnly: true });
            return res.redirect('/home')
        } else {
            res.sendStatus(401)
        }

    } catch(err) {
        console.error(err)
        res.sendStatus(400)
    }
    
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/templates/register.html')
})

app.post('/register', (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        
        const successfulRegistration = registerUser(username, password)
        
        if(!successfulRegistration) {
            return res.sendStatus(400)
        } else {
            return res.redirect('/login')
        }

    } catch(err) {
        console.error(err)
        return res.sendStatus(400)
    }
})

app.get('/home', (req, res) => {
    if(authenticateSession()) {
        return res.sendFile(__dirname + '/templates/home.html')
    } else {
        res.sendStatus(401)
    }
})

app.get('/publicResource', (req, res) => {
    console.log(req.headers['origin'])
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.send("'This is a public resource'")
})

app.get('/privateResource', (req, res) => {
    console.log(req.headers['origin'])
    res.setHeader('Access-Control-Allow-Origin', 'null')
    res.send("'This is a private resource'")
})

export function startServer(port) {
    app.listen(port, () => {
        console.log(`Server started on ${port}`)
    })
}
