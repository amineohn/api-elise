const express = require("express")
const app = express()
const port = 3001
app.get('/session/auth', (req, res) => {
  res.send({ express: 'test' })
});
app.listen(port, () => console.log(`Listening on port ${port}`))