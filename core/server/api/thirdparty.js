Twitter     = require('twitter'),
config      = require('../config');
NodeCache = require( "node-cache" );
myCache = new NodeCache();

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

        getUniqueTweets: function(tweets) {
            var tweetHandleArr = [],
                tweet,
                firstTweet,
                uniqTweets = [];

            for(var i = 0, l = tweets.length; i < l;i++) {
                tweet = tweets[i];
                if(tweetHandleArr.indexOf(tweet.user.screen_name) < 0) {
                    tweetHandleArr.push(tweet.user.screen_name);

                    // Set owner tweet to the top of the heap, move first tweet to bottom
                    if(tweet.user.screen_name === process.env.TWITTER_HANDLE && uniqTweets.length > 0) {
                        firstTweet = uniqTweets[0];
                        uniqTweets[0] = tweet;
                        uniqTweets.push(firstTweet);
                    }

                    uniqTweets.push(tweet);
                }
            };

            return uniqTweets;
        },

        getAll: function(client, callback) {
            var me = this;
            
            return client.get('lists/statuses.json', {
                list_id: process.env.TWITTER_LIST_ID,
                include_rts: false,
                count: 500
            }, function(error, tweets, response){
                if (!error) {

                    myCache.get('tweetlist', function(err, cachedTweets) {
                        if( !err) {
                            // Tweets are not cached

                            // date comparison is in milliseconds
                            var minDiff = (cachedTweets) ? cachedTweets.date - new Date() / 60000 : false;
                            if(cachedTweets == undefined || minDiff > 5)  {
                                uniqTweets = me.getUniqueTweets(tweets);
                                myCache.set('tweetlist', {
                                    date: new Date(),
                                    data: uniqTweets
                                });
                            } else {
                                // tweets are cached
                                uniqTweets = cachedTweets.data;
                            }

                            callback(uniqTweets);
                        }
                    });
                } else {
                    callback(error);
                }
            });
        }
    }
}

module.exports = thirdparty;
