const express = require('express')
const cors = require('cors')
const connection = require('./database/database')
const port = process.env.PORT || 3001
const app = express()

app.use(cors())
app.use(express())
app.use(express.urlencoded({ extended: true }))

// app.get(`/insert`, (req, res) => {
//     connection.query(
//         ` CREATE TABLE IF NOT EXISTS data (id int, type varchar, weight int, matter varchar, PRIMARY KEY("id"),
//           CREATE TABLE IF NOT EXISTS type (id int, type varchar, PRIMARY KEY("id")`,
//         (err) =>
//             res.json({
//                 database: {
//                     insert: true,
//                     stack: {
//                         errors: err,
//                     },
//                     message: err
//                         ? `Table as been added`
//                         : `an error was occured`,
//                 },
//             })
//     )
// })

app.get(`/`, (req, res) => {
    res.json({
        message: 'api should work now',
    })
})

app.param([`weight`], (req, res, next) => {
    connection.query(`INSERT INTO data (weight) VALUES (?)`, [
        req.params.weight,
    ])
    res.json({
        weight: req.params.weight,
        //type: req.params.type,
        // matter: req.params.matter,
    })
    next()
})

app.post(`/add/:weight`, (req, res, next) => {
    next.end()
})

app.param([`type`, `matter`], (req, res, next, type, matter) => {
    connection.query(`INSERT INTO type (type, matter) VALUES (?, ?)`, [
        req.params.type,
        req.params.matter,
    ])
    res.json({
        type: req.params.type,
        matter: req.params.matter,
    })
    next()
})

app.post(`/type/:type/:matter`, (req, res, next) => {
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

app.listen(port, () => console.log(`Listening on port ${port}`))
