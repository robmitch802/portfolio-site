const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

require('dotenv').config();

const app = express();

//serves static files from React app
app.use(express.static(path.join(__dirname, 'client/build')))

//use cors
app.use(cors());

//defines directory for image uploads
app.use(express.static('uploads'));

//use bodyParser to support app/json post data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect to MongoDB 
const uri = process.env.ATLAS_URI
mongoose.connect(
        uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
    );
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully.")
});

//set up route for posts
const postRouter = require('./server-side/routes/posts');

const getPost = async (req, res) => {
    console.log('getting post request');
    console.log(req.params.id);
    res.send(report)
}

//page and post retrieval
app.use('/posts', postRouter);
app.get('/post_page/:id', getPost);

// the catchall handler, for non-compliant requests
app.get('*', (req, res) => {
    res.sendFile(path.resolve('./client/public/index.html'))
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Portfolio listening on port ${port}`);