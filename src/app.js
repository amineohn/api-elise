const express = require('express')
const cors = require('cors')
const connection = require('./database/database')
const port = process.env.PORT || 3001
const app = express()
const nodemailer = require('nodemailer')
const connect = app.listen(port, () => console.log(`Listening on port ${port}`))

const io = require('socket.io')(connect, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE'],
    },
    transports: ['websocket', 'polling'],
    path: '/socket.io',
    serveClient: true,
})
require('dotenv').config()
app.use(cors())
app.use(express())
app.use(express.json())
app.use((req, res, next) => {
    const origin = req.get('origin')
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', true)
    res.header(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS, PUT, PATCH, DELETE'
    )
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma'
    )
    if (req.method === 'OPTIONS') {
        res.sendStatus(204)
    } else {
        next()
    }
})
app.use(express.urlencoded({ extended: true }))

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    secureConnection: false,
    port: process.env.PORT,
    tls: {
        ciphers: 'SSLv3',
    },
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.PASSWORD,
    },
})
io.on('connection', function (socket) {
    socket.on('add', function (data) {
        socket.emit('broadcast', data)
    })
    var hs = socket.handshake
    console.log('A socket is connected!')
    var intervalID = setInterval(function () {
        if (hs && hs.session)
            hs.session.reload(function () {
                hs.session.touch().save()
            })
    }, 60 * 100)
    socket.on('disconnect', function () {
        console.log('A socket is disconnected!')
        clearInterval(intervalID)
    })
    socket.join(socket.handshake.sessionID)
})
app.get(`/`, (req, res) => {
    res.json({
        success: true,
        message: 'api should work now',
    })
})
app.post(`/add`, (req, res) => {
    app.locals.io = io
    if (res) {
        io.emit('refresh feed')
    } else {
        io.emit('error')
    }
    connection.query({
        sql: `INSERT INTO data (matter, type, weight) VALUES (?, ?, ?)`,
        values: [req.body.matter, req.body.type, req.body.weight],
    })
    io.on('add', (data) => {
        io.emit('add', [
            {
                weight: req.body.weight,
                type: req.body.type,
                matter: req.body.matter,
            },
        ])
        console.log(data)
    })
    /*  res.json({
        weight: req.body.weight,
        type: req.body.type,
        matter: req.body.matter,
    })*/
})

app.post(`/code`, (req, res) => {
    connection.query('SELECT * from data', (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
        }
        const options = {
            from: 'smkamine@outlook.fr',
            to: 'amineprojet7@gmail.com',
            subject: `Poids Fin de journée`,
            text: `Liste des matières: \n\n ${JSON.stringify(rows)}`,
            html: `Liste des matières: <br /> <br />${JSON.stringify(rows)}`,
        }
        req.body.code === 'generatedsuccess'
            ? transporter.sendMail(options, (error, info) =>
                  error
                      ? console.log(error)
                      : console.log('Message sent: ' + info.response)
              )
            : res.json({
                  code: 'notfound',
              })
    })

    res.json({
        code: req.body.code,
    })
})
app.delete(`/delete/:id`, (req, res) => {
    connection.query({
        sql: `DELETE FROM data WHERE id = ${req.params.id}`,
    })
    res.json({
        id: req.params.id,
    })
})

app.get(`/list`, (req, res) => {
    connection.query(`SELECT * from data`, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
        }
        res.json({
            success: true,
            data: rows,
        })
    })
})
setInterval(() => {
    connection.query('SELECT 1')
}, 5000)
