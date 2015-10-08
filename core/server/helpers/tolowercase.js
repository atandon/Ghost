// # ToLowerCase Helper
//
// Usage:  `{{tolowercase str}}`
//
// Returns lowercase of string

var hbs             = require('express-hbs'),
    tolowercase;

tolowercase = function (context, str) {
    var val = context || str;
    val = val.split(' ').join('-');
    return val.toLowerCase();
};

module.exports = tolowercase;
