var mongoose = require('mongoose');
var express = require('express');

var favouriteSchema = new mongoose.Schema({
    email: String,
    songname: String
})
var favourite = module.exports = mongoose.model('favourite', favouriteSchema);

module.exports.getFavouriteByName = function (songname, callback) {
    favourite.find(songname, callback);
}
module.exports.getFavouriteSongByName = function (songname, callback) {
    favourite.findOne(songname, callback);
}
module.exports.addFavouriteSong = function (Newsongname, callback) {
    Newsongname.save(callback);
}
module.exports.deleteFavouriteByName = function (songname, callback) {
    favourite.deleteOne(songname, callback);
}