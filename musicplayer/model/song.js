var mongoose = require('mongoose');
var express = require('express');

var songSchema = mongoose.Schema({
    albumname: String,
    songname: String,
    genre: String,
    artist: String,
    date: Date,
    songType: String,
    song: String,
})
var song = module.exports = mongoose.model('song', songSchema);

module.exports.getSongBySongname = function (songname, callback) {
    song.findOne(songname, callback);
}

module.exports.getSongsByLanguage = function (songname, callback) {
    song.findOne(songname, callback);
}

module.exports.getSongsByDate = function (songname, callback) {
    song.findOne(songname, callback);
}
module.exports.getSongsBySongType = function (songname, callback) {
    song.findOne(songname, callback);
}
module.exports.getAllMusic = function (callback) {
    song.find({}, callback);
}
module.exports.addSong = function (newSong, callback) {

    newSong.save(callback);

}