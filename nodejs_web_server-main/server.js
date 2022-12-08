const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors')
const {logger} = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 5000;

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
const whiteList = ['https://www.google.com','http://127.0.01:5500', 'http://localhost:5000/'];
const corsOptions = {
    origin: (origin,callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        } else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
} 
app.use(cors(corsOptions))

// build in middleware to handle urlencoded data
// In other words, form data:
// 'content-type' : application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// built-in-middleware for json
app.use(express.json())

//serve static files
app.use('/',express.static(path.join(__dirname,'/public')))
app.use('/subdir',express.static(path.join(__dirname,'/public')))

app.use('/',require('./routes/root'))
app.use('/subdir',require('./routes/subdir'))
app.use('/employees',require('./routes/api/employees'))

app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }
    else if(req.accepts('json')){
        res.json({error: "404 Not found"})
    }
    else {
        res.type('txt').send('404 not found')
    }
})

app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));