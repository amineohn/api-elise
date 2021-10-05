const express = require('express')
const cors = require('cors')
const connection = require('./database/database')
const port = process.env.PORT || 3001
const app = express()
const nodemailer = require('nodemailer')
io = require('socket.io')(app)

require('dotenv').config()
app.use(cors())
app.use(express())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const server = false
const transporter = nodemailer.createTransport({
    host: server ? process.env.HOST : process.env.HOST_SERVER,
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

app.get(`/`, (req, res) => {
    res.json({
        success: true,
        message: 'api should work now',
    })
})
app.post(`/add`, (req, res) => {
    connection.query({
        sql: `INSERT INTO data (matter, type, weight) VALUES (?, ?, ?)`,
        values: [req.body.matter, req.body.type, req.body.weight],
    })
    res.json({
        weight: req.body.weight,
        type: req.body.type,
        matter: req.body.matter,
    })
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
        weight: req.body.weight,
        type: req.body.type,
        matter: req.body.matter,
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

app.listen(port, () => console.log(`Listening on port ${port}`))
