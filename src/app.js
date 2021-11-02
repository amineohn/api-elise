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
io.on('connection', (socket) => {
    socket.on('add', (data) => {
        socket.emit('broadcast', data)
    })
    var hs = socket.handshake
    console.log('A socket is connected!')
    var intervalID = setInterval(() => {
        if (hs && hs.session)
            hs.session.reload(() => {
                hs.session.touch().save()
            })
    }, 60 * 100)
    socket.on('disconnect', () => {
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
})
const forColumn = (matrix, col, plus) => {
    var column = []
    for (var i = 0; i < matrix.length; i++) {
        column.push(plus ? matrix[i][col] + `kg` : matrix[i][col])
    }
    return column
}
app.post(`/code`, (req, res) => {
    connection.query('SELECT * from data', (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
        }
        let weight = forColumn(rows, 'weight', true)
        let type = forColumn(rows, 'type', false)
        let matter = forColumn(rows, 'matter', false)
        const options = {
            from: 'smkamine@outlook.fr',
            to: 'amineprojet7@gmail.com',
            subject: `Poids Fin de journée`,
            text: `Liste des matières: \n\n Poids: ${weight.join(
                ' '
            )} \n Types: ${type.join(' ')} \n Matières: ${matter.join(' ')}`,
            html: `Liste des matières: <br /> <br />Poids: ${weight.join(
                ' '
            )} <br /> Types: ${type.join(' ')} <br /> Matières: ${[
                matter.join(' '),
            ]}`,
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
        res.json({
            weight: forColumn(rows, 'weight', true),
            type: forColumn(rows, 'type', false),
            matter: forColumn(rows, 'matter', false),
            code: req.body.code,
        })
        connection.query(
            'SELECT SUM(weight) AS total FROM data',
            (err, rows) => {
                if (err) {
                    res.status(400).json({ error: err.message })
                }
                const options = {
                    from: 'smkamine@outlook.fr',
                    to: 'amineprojet7@gmail.com',
                    subject: `Poids Fin de journée`,
                    text: `Total du jour \n\n Total: ${rows[0].total} kgs`,
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
            }
        )
    })
})

app.delete(`/delete/:id`, (req, res) => {
    if (res) {
        io.emit('refresh feed')
    } else {
        io.emit('error')
    }
    connection.query({
        sql: `DELETE FROM data WHERE id = ${req.params.id}`,
    })
    io.on('delete', (data) => {
        io.emit('delete', [
            {
                id: req.body.id,
            },
        ])
        console.log(data)
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
