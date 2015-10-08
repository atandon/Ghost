// # linkifyTweet Helper
//
// Usage:  `{{linkifyTweet str}}`
//
// Returns tweet string with links

var hbs             = require('express-hbs'),
    linkifyTweet;

linkifyTweet = function (context, options) {
    var val = context || '';
    var tweet = val.replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,"<a href='$1'>$1</a>");
    tweet = tweet.replace(/(^|\s)@(\w+)/g, "$1<a href=\"http://www.twitter.com/$2\">@$2</a>");
    return tweet.replace(/(^|\s)#(\w+)/g, "$1<a href=\"http://search.twitter.com/search?q=%23$2\">#$2</a>")
};

module.exports = linkifyTweet;
