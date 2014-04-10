# tinderbot

  A platform for developing bots which interact with the Tinder dating app

## Introduction

  tinderbot is a node module which allows you to develop 'bots' which interact on the Tinder dating app. 
  It provides an easy to use mechanism for retrieving your Facebook access tokens which are used to authorize your bot for interacting with the Tinder apis, and exposes
  a hook for checking for Tinder updates, chatting with matches, etc. 
  
  Below is a simple bot which periodically 'likes' all matches nearby and tells them to play Castle Clash.
  
  var tinderbot = require('tinderbot');
    var bot = new tinderbot();
    var _ = require('underscore')
    
    bot.mainLoop = function() {
      client.getRecommendations(10, function(error, data){
        _.chain(data.results)
          .pluck('_id')
          .each(function(id) {
            client.like(id, function(error, data) {
              if (data.matched) {
                client.sendMessage(
                  id,
                  "Hey, I'm playing this cool new game Castle Clash. Have you heard of it?"
                );
              }
            });
          });
      });
    };
    
    bot.live();
  
## Installation

    $ npm install tinderbot
    
## Setup 



## Supported APIs

### .authorize(fb token, callback)

  Authorizes the `TinderClient`. You must call this before any other method.
  
* `fb token` is a facebook user access token. You would acquire this by having your user log in using your application 
* `callback` is called when the request completes 

### .sendMessage(user id, message, callback)

  Sends a message to a user. 
  
* `user id` is the user's id. This is obtained e.g via `getRecommendations` 
* `message` is the message to send. 
* `callback` is called when the request completes 

### .like(user id, callback)
  
  Likes a user (swipes right).
  
* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `callback` is called when the request completes 

### .pass(user id, callback)

  Pass on a user (swipes left).
  
* `user id` is the user's id. This is obtained e.g  via `getRecommendations`
* `callback` is called when the request completes 

### .getRecommendations(limit, callback)

  Gets nearby users
  
* `limit` is how many results to limit the search to 
* `callback` is called when the request completes 

### .getUpdates(callback)

  Checks for updates. The response will show you new messages, new matches, new blocks, etc. 
  
* `callback` is called when the request completes 

### .getHistory(callback)

  Gets the complete history for the user (all matches, messages, blocks, etc.).
  
  NOTE: Old messages seem to not be returned after a certain threshold. Not yet sure what exactly that timeout is. The official client seems to get this update once when the app is installed then cache the results and only rely on the incremental updates

* `callback` is called when the request completes 

### .updatePosition(longitude, latitude, callback)

  Updates your profile's geographic position

* `longitude` is the longitude of the new position
* `latitude` is the latitude of the new position
* `callback` is called when the request completes 


## Examples

  The following example authorizes a client, gets some nearby profiles, likes all of them, and sends a message to any of the ones that match
  
    var tinder = require('tinderjs');
    var client = new tinder.TinderClient();
    var _ = require('underscore')
    
    client.authorize(
      <fb user token>,
      function() {
        client.getRecommendations(10, function(error, data){
          _.chain(data.results)
            .pluck('_id')
            .each(function(id) {
              client.like(id, function(error, data) {
                if (data.matched) {
                  client.sendMessage(id, "hey ;)");
                }
              });
            });
        });
      });
    });
    
## License

  MIT