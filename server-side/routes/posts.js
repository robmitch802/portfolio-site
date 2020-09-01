const router = require('express').Router();
let Post = require('../models/post.model');

//getting posts
router.route('/').get((req, res) => {
    Post.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err));
});

//add a new post
router.route('/add').post((req, res) => {
    const title = req.body.title;
    const text = req.body.text;
    const date = Date.parse(req.body.date);

    const newPost = new Post ({
        title,
        text, 
        date,
    });

    newPost.save()
        .then(() => res.json('Post added!'))
        .catch(err => res.status(400).json('Error: ' + err));
})

//get a specific post
router.route('/:id').get((req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(400).json('Error: ' + err));
})

//return the specific post page
router.route('/post_page/:id').get((req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(400).json('Error: '+ err));
})

//find a post and delete it
router.route('/:id').delete((req, res) => {
    Post.findByIdAndDelete(req.params.id)
        .then(() => res.json('Exercise deleted.'))
        .catch(err => res.status(400).json('Error: '+ err))
})

//update a post
router.route('/update/:id').post((req, res)=> {
    Post.findById(req.params.id)
        .then(post => {
            post.title = req.body.title;
            post.text = req.body.text;
            post.date = Date.parse(req.body.date);

            post.save()
                .then(() => res.json('Exercise updated!'))
                .catch(err => res.status(400).json('Error: ' + err));
        })
})

module.exports = router;