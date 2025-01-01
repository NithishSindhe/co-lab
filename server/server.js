import express from 'express';
import cors from 'cors';
const app = express()
app.use(cors())
const port = 3000


app.get('/bitArray', function (req, res) {
    const bitArray = new Array(1000).fill('#000000'); 
    res.send(bitArray)
})

app.listen(port)
