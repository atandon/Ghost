Twitter     = require('twitter'),
config      = require('../config');

var twitterClient;

var thirdparty = {
    twitter: {
        init: function() {
            if(!twitterClient) {
                twitterClient = new Twitter({
                    consumer_key: process.env.TWITTER_CONSUMER_KEY,
                    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
                    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
                    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
                });
            }

            return twitterClient;
        },
        getAll: function(client, callback) {
            return client.get('lists/statuses.json', {
                list_id: process.env.TWITTER_LIST_ID,
                include_rts: false,
                count: 500
            }, function(error, tweets, response){
                console.log(response);
                if (!error) {

                    var tweetHandleArr = [];
                    var tweet;
                    var firstTweet;
                    for(var i = 0, l = tweets.length; i < l;i++) {
                        tweet = tweets[i];
                        if(tweetHandleArr.indexOf(tweet.user.name) < 0) {
                            tweetHandleArr.push(tweet.user.name);

                            // Set owner tweet to the top of the heap, move first tweet to bottom
                            if(tweet.user.name = process.env.TWITTER_HANDLE && uniqTweets.length > 0) {
                                firstTweet = uniqTweets[0];
                                uniqTweets[0] = tweet;
                                uniqTweets.push(firstTweet);
                            }

                            console.log(uniqTweets);

                            uniqTweets.push(tweet);
                        }
                    };

                    callback(uniqTweets);
                } else {
                    callback(error);
                }
            });
        }
    }
}

module.exports = thirdparty;
