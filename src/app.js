const express = require('express')
const cors = require('cors')
const connection = require('./database/database')
const port = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express())
app.use(express.urlencoded({ extended: true }))

app.get(`/insert`, (req, res) => {
    connection.query(
        ` CREATE TABLE IF NOT EXISTS data (id int, type varchar, weight int, matter varchar, PRIMARY KEY("id"); 
          CREATE TABLE IF NOT EXISTS type (id int, type varchar, PRIMARY KEY("id")`,
        (err) =>
            res.json({
                database: {
                    insert: true,
                    stack: {
                        errors: err,
                    },
                    message: err
                        ? `Table as been added`
                        : `an error was occured`,
                },
            })
    )
})

app.get(`/`, (req, res) => {
    res.json({
        message: 'api should work now',
    })
})

app.param([`type`, `weight`, `matter`], (req, res, next) => {
    connection.query(
        `INSERT INTO data (type, weight, matter) VALUES (?, ?, ?)`,
        [req.params.type, req.params.weight, req.params.matter]
    )
    res.json({
        weight: req.params.weight,
        type: req.params.type,
        matter: req.params.matter,
    })
    next()
})

app.post(`/add/:type/:weight/:matter`, (req, res, next) => {
    next.end()
})

app.param([`value`], (req, res, next, value) => {
    connection.query(`INSERT INTO type (type) VALUES (?)`, [value])
    res.json({
        type: value,
    })
    next()
})

app.post(`/put/:value`, (req, res, next) => {
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
            error: false,
        })
    })
})

app.get(`/type`, (req, res) => {
    connection.query(`SELECT * from type`, (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message })
            return
        }
        res.json({
            success: true,
            data: rows,
            error: false,
        })
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`))
