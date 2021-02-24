const express = require('express');
const router = express.Router();
const { Blog } = require('../models/Blog');
const { auth } = require('../middleware/auth');
const { unlink } = require('fs');
const multer = require('multer');

/* =================================
        Storage Multer Config
================================= */

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/blog/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.png' && ext !== '.mp4') {
            return cb(res.status(400).end('only jpg, png, mp4 is allowed'), false);
        }
        cb(null, null);
    },
});

var upload = multer({ storage: storage }).single('file');

/* =================================
                Blog
================================= */
router.post('/createPost', (req, res) => {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var today = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    let post = req.body;
    post.date = new Date(Date.UTC(year, month, today, hours, minutes, seconds));
    console.log('포스트 등록날짜', post.date);
    const blog = new Blog(post);
    blog.save((err, postInfo) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res.status(200).json({ success: true, postInfo });
    });
});

router.post('/uploadfiles', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }
        return res
            .status(200)
            .json({ success: true, url: res.req.file.path, fileName: res.req.file.filename });
    });
});

router.get('/getBlogs', (req, res) => {
    Blog.find()
        .populate('writer')
        .exec((err, blogs) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, blogs });
        });
});

router.post('/getPost', (req, res) => {
    console.log(req.body);
    Blog.findOne({ _id: req.body.postId })
        .populate('writer')
        .exec((err, post) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({ success: true, post });
        });
});

router.post('/imageDelete', (req, res) => {
    unlink(req.body.path, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }
        res.json({ success: true });
    });
});

router.post('/deletePost', (req, res) => {
    console.log(req.body._id);
    let files = req.body.files;
    Blog.findOneAndDelete({ _id: req.body._id }, (err) => {
        if (err) {
            return res.json({ success: false, err });
        }
        files.map((file) => {
            unlink(file, (err) => {
                if (err) {
                    return res.json({ success: false, err });
                }
            });
        });
        res.json({ success: true });
    });
});

module.exports = router;
