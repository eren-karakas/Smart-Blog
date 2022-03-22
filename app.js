const express = require('express');
const ejs = require('ejs');

const app = express()

const server = '127.0.0.1'
const port = '3000'

// TEMPLATE ENGINE
app.set('view engine', 'ejs')

// MIDDLEWARES
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Merhaba')
})

app.listen(port, server, () => {
    console.log(`Server is active ! http://${server}:${port}/`);
})