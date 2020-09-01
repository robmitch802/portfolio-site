const express = require('express');
const path = require('path');
const generatePassword = require('password-generator');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');

require('dotenv').config();

const app = express();

//serves static files from React app
app.use(express.static(path.join(__dirname, 'client/build')))

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
})

//grab some passwords using password-generator
app.get('/api/passwords', (req, res) => {
    const count = 4;

    //generate these passwords
    const passwords = Array.from(Array(count).keys()).map(i => 
        generatePassword(12, false)
    )

    //return them as json
    res.json(passwords);

    console.log(`Sent ${count} passwords...`);

});

//set up route for image uploads
app.use('/api/images', require('/server-side/routes/api/images'));

//sets up get action for images
router.get('/', (req, res) => {
    //finds directory and stores it
    const uploadsDirectory=path.join('uploads');
    //reads files in the directory
    fs.readdir(uploadsDirectory, (err, files) => {
        if (err) {
            return res.json('Error: '+ err)
        }
        //if no files in directory, return message
        if (files.length === 0) {
            return res.json('No Images Uploaded')
        }
        //returns array of filenames in uploads directory
        return res.json({ files })
    })
});

//set up file placement using multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

const uploads = multer({ storage })

//router posting method for image uploads
router.post('/', uploads.single('image'), async (req, res) => {
    const image = req.file.path;
    res.json('Image uploaded successfully!' + image)
})


//set up route for posts
const postRouter = require('/server-side/routes/posts');

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
    res.sendFile(path.resolve('/client/public/index.html'))
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Portfolio listening on port ${port}`);