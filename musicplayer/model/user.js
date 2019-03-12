var express = require('express');
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    username: String,
    password: String,
    email: String,
    contact: Number,
    propic: String
})
var user = module.exports = mongoose.model('user', userSchema);
module.exports.getUserByEmail = function (email, callback) {
    console.log(email);
    user.findOne(email, callback);
}
module.exports.addUser = function (newUser, callback) {

    newUser.save(callback)
}