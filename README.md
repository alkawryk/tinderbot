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
      bot.client.getRecommendations(10, function(error, data){
        _.chain(data.results)
          .pluck('_id')
          .each(function(id) {
            bot.client.like(id, function(error, data) {
              if (data.matched) {
                bot.client.sendMessage(
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

### Create a Facebook application

  This won't need to be approved, nor publicly available. Visit [the Facebook developer center](https://developers.facebook.com/) and select "Apps > Create a New App".
  Give it a name (I named mine "TinderBot") and a category (e.g "Communication").
  
### Authorize localhost as a Valid OAuth redirect URI 

  Once your app has been created, follow the Settings link in the app's dashboard, and go over to the Advanced tab. Look for "Valid OAuth redirect URI's" and add `http://localhost:8080/fbtoken` (or whatever you decide to use for your listen port). Also ensure the "Client OAuth Login" setting is enabled. 

### Setting up your tinder bot 
  
  Copy your app's App Id from the main dashboard for your app. Then, create a new .js (e.g bot.js) file with the following contents:
  
    var tinderbot = require('tinderbot');
    var bot = new tinderbot();
    
    bot.FBClientId = <app id>
    bot.FBClientSecret = <app secret>
    
    bot.mainLoop = function() {
      console.log("Hello world!");
    };
    
    bot.live();
    
### Running the bot 

  In a console, execute 
  
    $ node bot.js
    
  To authorize your bot to act on behalf of your Facebook profile, open up a browser and visit `http://localhost:8080/login`. You should be prompted for your Facebook credentials. Once logged in, look back at the console and notice the periodic "Hello world" logs. Congratulations, you've just created your first Tinder bot! 
  Make sure you keep this window open if you're planning on running your bot for a long time (ie more than an hour or so), as it will automatically refresh when your Facebook tokens have expired. 

## Configuration

### .mainLoop

  This should be set to a function that will be executed periodically. Whenever this is executed, you can assume that your bot is authorized to interact with the Tinder API on behalf of your Facebook profile. Typically you would call methods from the [tinderjs](https://github.com/alkawryk/tinderjs) module to interact with the API.
    
### .mainLoopInterval

  The interval in milliseconds at which the mainLoop is executed.
    
### .port

  Your bot wraps a simple express server. This will be the port the server listens on.
  
### .client

  This is the authorized tinder client you can use to interact with the tinder API
  
### .live()

  This starts the express server.
  
### .die()

  This kills the express server.
  
## License

  MIT