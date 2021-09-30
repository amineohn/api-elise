const express = require('express')
const cors = require('cors')
const connection = require('./database/database')
const port = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express())
app.use(express.urlencoded({ extended: true }))

app.get(`/`, (req, res) => {
    res.json({
        success: true,
        message: 'api should work now',
    })
})
app.param([`matter`, `type`, `weight`], (req, res, next) => {
    connection.query({
        sql: `INSERT INTO data (matter, type, weight) VALUES (?, ?, ?)`,
        values: [req.params.weight, req.params.type, req.params.matter],
    })
    res.json({
        weight: req.params.matter,
        type: req.params.type,
        matter: req.params.weight,
    })
    next()
})

app.get(`/add/:matter/:type/:weight`, (req, res, next) => {
    next.end()
})

app.get(`/list`, (req, res) => {
    connection.query(`SELECT * from data`, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({
            success: true,
            data: rows,
        })
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
