var express = require('express');
var bodyParser = require('body-parser');
var tinder = require('tinderjs').TinderClient;
var request = require('request');

/**
 * Initializes a new instance of the TinderBot class 
 */
function TinderBot() {
  
  /**
   * When the current facebook token expires 
   */
  var fbTokenExpiresIn = null;
  
  /**
   * The current express server associated with this bot 
   */
  var app = express();
  var _this = this;
  var server = null;
  
  /**
   * The amount of time, in milliseconds, between executing the mainLoop function
   */
  this.mainLoopInterval = 5000;
  
  /**
   * The function to be executed repeatedly after each timeout 
   */
  this.mainLoop = function() { };
  
  /**
   * The Facebook app ID from which user tokens will be generated 
   */
  this.FBClientId = null;
  
  /**
   * The Facebook app secret
   */
  this.FBClientSecret = null;
  
  /**
   * The port on which the express server will listen on 
   */
  this.port = "8080";
  
  /**
   * The client you can use to issue requests to tinder 
   */
  this.client = new tinder();
  
  /**
   * Starts the express server 
   */
  this.live = function() {
    server = app.listen(this.port);
  };
  
  /**
   * Closes the express server 
   */
  this.die = function(){
    if (server) {
      server.close();
    }
  };
  
  app.use(bodyParser());
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });
  app.set('view engine', 'jade');
  
  /**
   * Renders the page for when a user has been authenticated by Facebook 
   */
  app.get('/fbtoken', function(req, res){
    res.render("auth");
  });
  
  /**
   * Since the Facebook access_token is only available in the browser URL fragment,
   * it is not available server-side so we need to post it to the server from the browser.
   * This is the entry point for persisting that token  
   */
  app.post('/fbtoken', function(req, res){
    var hash = req.body.hash;
    var tokenField = "access_token=";
    var expiresField = "&expires_in=";
    var access_token = hash.substring(hash.indexOf(tokenField) + tokenField.length, hash.indexOf(expiresField));
    var expiryInSeconds = hash.substring(hash.indexOf(expiresField) + expiresField.length);
    
    fbTokenExpiresIn = new Date(new Date().getTime() + expiryInSeconds * 1000);
    
    // Once we have the Facebook access token, we need the user ID associated with the token.
    request({
      url: 'https://graph.facebook.com/debug_token?input_token=' + access_token + '&access_token=' + _this.FBClientId + '|' + _this.FBClientSecret,
      method: 'GET'
    }, function(err, response, body){
      
      if (err) {
        throw new "Failed to get user id: " + err;
      } else {
        
        body = JSON.parse(body);
        
        if (!body.data.user_id) {
          throw new "Failed to get user id.";
        }
        
        // Once we have the Facebook access token and user id, we can use it to authorize our bot 
        // to start issuing requests to the Tinder API 
        _this.client.authorize(access_token, body.data.user_id, function(){
          
          var timer = setInterval(function(){
            if (new Date().getTime() >= fbTokenExpiresIn.getTime()) {
              
              clearInterval(timer);
              
              // Have the client refresh their screen to obtain
              // a new Facebook client token 
              res.json({
                redirect: '/login'
              });
              
            } else {
              
              if (_this.mainLoop) {
                _this.mainLoop();
              }
              
            }
          }, _this.mainLoopInterval); 
        }); 
      }
    });
  });
  
  /**
   * Entry point for getting the Facebook access token. This will bring you to a Facebook auth
   * dialogue and eventually grant your access token
   */
  app.get('/login', function(req, res){
    res.redirect('https://www.facebook.com/dialog/oauth?client_id=' + _this.FBClientId + '&response_type=token&redirect_uri=http://localhost:' + _this.port + '/fbtoken');
  });
}

module.exports = TinderBot;
