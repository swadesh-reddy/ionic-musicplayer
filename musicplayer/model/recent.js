var mongoose = require('mongoose');
var express = require('express');

var recentSchema = new mongoose.Schema({
    email: String,
    songname: String
})
var recent = module.exports = mongoose.model('recent', recentSchema);

module.exports.getRecentSongsByName = function (songname, callback) {
    recent.find(songname, callback);
}
module.exports.getRecentSongByName = function (songname, callback) {
    recent.findOne(songname , callback);
}
module.exports.addRecentSong = function (Newsong, callback) {
    Newsong.save(callback);
}
module.exports.deleteRecentSongByName = function (songname, callback) {
    recentSong.deleteOne(songname, callback);
}