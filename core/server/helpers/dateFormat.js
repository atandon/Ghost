// # dateFormat Helper
//
// Usage:  `{{dateFormat creation_date format="MMMM YYYY"}}`
//
//
var hbs = require('express-hbs'),
    moment = require('moment'),
    dateFormat;

dateFormat = function (context, options) {
    var val = context;
    var f = options.hash.format || "MMM Do, YYYY";
    return moment(Date(context)).format(f);
};

module.exports = dateFormat;