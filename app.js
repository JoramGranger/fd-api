const express = require('express');
const app = express();
const port = 3000;


// middleware
app.use(express.json());

// routes
app.get('/', (req, res) => {
    res.send('hello world');
});

// boot
app.listen(port, () => {
    console.log('server running');
});