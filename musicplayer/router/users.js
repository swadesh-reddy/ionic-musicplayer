var fs = require('fs');
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken')
var config = require('../config');
var User = require('../model/user');
var Song = require('../model/song');
var Favourite = require('../model/favourite');
var Recent = require('../model/recent');
var jwt_decode = require('jwt-decode');
var path = require('path');

var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, res, cb) {
        cb(null, './images/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
var upload = multer({ storage: storage });

router.post('/register', (req, res, next) => {
    console.log(req);
    let checkEmail = { "email": req.body.email }
    let newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        contact: req.body.contact,
    })
    User.getUserByEmail(checkEmail, (err, user) => {
        if (err) { throw err }
        else if (user) {
            res.json({
                success: false
            });
        }
        else {
            User.addUser(newUser, (err, user) => {

                if (err) { res.send({ success: false }) }
                else {
                    res.send({ success: true });
                }
            })

        }
    })
})

router.post('/login', (req, res, next) => {

    let authenicate = {
        email: req.body.email,
        password: req.body.password
    }
    User.getUserByEmail(authenicate, (err, user) => {

        if (err) { throw err }
        if (!user) { res.json({ success: false }); }
        else {
            var users = { user };
            const token = jwt.sign(users, config.secret,
                {
                    expiresIn: 6048000 // 1 week
                });
            res.json({
                success: true,
                token: token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    contact: user.contact,
                    propic: user.propic
                }
            });
        }
    })
})

router.post('/update', verifyToken, upload.single('propic'), (req, res, next) => {

    var decoded = jwt_decode(req.token);
    let email = {
        email: decoded.user.email
    }
    console.log(email);
    User.getUserByEmail(email, (err, user) => {
        if (err) throw err;
        else {
            user.username = req.body.username;
            user.email = req.body.email;
            user.contact = req.body.contact;
            user.propic = req.file.path;
            user.save(function (err) {
                if (err) throw err;
                else {
                    res.json({
                        success: true,
                    });
                }
            })
        }
    });
});

router.post('/uploadsong', verifyToken, upload.single('song'), (req, res, next) => {

    var decoded = jwt_decode(req.token);

    let newSong = new Song({
        albumname: req.body.albumname,
        songname: req.body.songname,
        genre: req.body.genre,
        artist: req.body.artist,
        date: new Date(),
        songType: req.body.songType,
        song: req.file.path
    })
    Song.addSong(newSong, (err, song) => {

        if (err) { res.send({ success: false }) }
        else {
            res.send({ success: true });
        }
    })
});

router.get('/getMusic', (req, res) => {
    Song.getAllMusic(function (err, data) {
        if (err) { throw err }
        else {
            res.json(data);
        }
    })
})

router.get('/getMusicByName', (req, res) => {
    console.log(req.query.songname)
    fs.readFile('./' + req.query.songname, (error, file) => {
        res.end(file)
    });
})

router.get('/download', verifyToken, (req, res) => {

    filepath = path.join(__dirname, '../images') + '/' + req.query.songname;
    console.log(filepath);
    res.sendFile(filepath);
})

router.get('/getFavouriteMusic', verifyToken, (req, res) => {
    var decoded = jwt_decode(req.token);

    let userFavourite = {
        email: decoded.user.email
    }
    Favourite.getFavouriteByName(userFavourite, function (err, data) {
        if (err) { throw err }
        else {
            res.json(data);
        }
    })
})
router.get('/getRecentMusic', verifyToken, (req, res) => {
    var decoded = jwt_decode(req.token);

    let userFavourite = {
        email: decoded.user.email
    }
    Recent.getRecentSongsByName(userFavourite, function (err, data) {
        if (err) { throw err }
        else {
            res.json(data);
        }
    })
})
router.get('/findRecentMusic', verifyToken, (req, res) => {
    var decoded = jwt_decode(req.token);
    let userFavourite = {
        email: decoded.user.email,
        songname: req.query.songname
    }
    Recent.getRecentSongByName(userFavourite, function (err, data) {
        if (err) { throw err }
        else {

            res.json(data);
        }
    })
})
router.get('/checkFavouriteSong', verifyToken, (req, res) => {
    var decoded = jwt_decode(req.token);
    var checkSong  = {
        email: decoded.user.email,
        songname: req.query.songname
    }
    Favourite.getFavouriteSongByName(checkSong, function (err, data) {
        if (err) { throw err }
        else {
            res.json(data);
        }
    })
})
router.get('/deleteFavouriteSong', verifyToken, (req, res) => {
    var decoded = jwt_decode(req.token);
    var checkSong  = {
        email: decoded.user.email,
        songname: req.query.songname
    }
    Favourite.deleteFavouriteByName(checkSong, function (err, data) {
        if (err) { throw err }
        else {
            res.json({success:true});
        }
    })
})
router.post('/addFavouriteMusic', verifyToken, (req, res) => {
    var decoded = jwt_decode(req.token);

    let favouriteSong = new Favourite({
        email: decoded.user.email,
        songname: req.body.songname
    })

    Favourite.addFavouriteSong(favouriteSong, function (err, data) {
        if (err) { throw err }
        else {
            res.json({ success: true });
        }
    })
})
router.post('/addRecentMusic', verifyToken, (req, res) => {
    var decoded = jwt_decode(req.token);
        let recentSong = new Recent({
                email: decoded.user.email,
                songname: req.body.songname
            })
            Recent.addRecentSong(recentSong, function (err, data) {
              if (err) { throw err }
                else {
                    res.json({ success: true });
                }
            })
})

function verifyToken(req, res, next) {

    const bearHeader = req.headers['authorization'];
    if (typeof bearHeader !== "undefined") {

        const bearer = bearHeader.split(' ');
        const bearToken = bearer[1];
        console.log(req.token);
        req.token = bearToken;
        next();
    }
    else {
        console.log(req.body);
        res.sendStatus(403);
    }

}

module.exports = router;