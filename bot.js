var express = require('express');
var tinder = require('tinderjs').TinderClient;

function TinderBot()
{
  var fbTokenExpiresIn = null;
  var app = express();
  var client = new tinder();
  var _this = this;
  
  this.mainLoopInterval = 5000;
  
  this.mainLoop = function() {
    console.log("Now ... ");
  };
  
  this.FBClientId = "850623398305311";
  
  this.port = "8080";
  
  app.use(express.bodyParser());
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });
  app.set('view engine', 'jade');
  
  app.get('/fbtoken', function(req, res){
    res.render("auth");
  });
  
  app.post('/fbtoken', function(req, res){
    var hash = req.body.hash;
    var tokenField = "access_token=";
    var expiresField = "&expires_in=";
    var access_token = hash.substring(hash.indexOf(tokenField) + tokenField.length, hash.indexOf(expiresField));
    var expiryInSeconds = hash.substring(hash.indexOf(expiresField) + expiresField.length);
    
    fbTokenExpiresIn = new Date(new Date().getTime() + expiryInSeconds * 1000);
    
    client.authorize(access_token, function(){
      
      var timer = setInterval(function(){
        if (new Date().getTime() >= fbTokenExpiresIn.getTime()) {
          
          clearInterval(timer);
          res.redirect('/login');
          
        } else {
          
          if (_this.mainLoop) {
            _this.mainLoop();
          }
          
        }
      }, _this.mainLoopInterval);
      
      res.redirect("/main");
      
    });
    
  });
  
  app.get('/login', function(req, res){
    res.redirect('https://www.facebook.com/dialog/oauth?client_id=' + _this.FBClientId + '&response_type=token&redirect_uri=http://localhost:' + _this.port + '/fbtoken');
  });
  
  app.listen(this.port);
}

var bot = new TinderBot();
