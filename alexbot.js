var TinderBot = require('../TinderBot/tinderbot');
var CleverBot = require('cleverbot-node');
var TinderClient = require('../Tinder/tinder').TinderClient;
var client = new TinderClient();
var _ = require('underscore');

var start = new Date();

var alexbot = new TinderBot();
alexbot.FBClientId = process.env.FB_CLIENT_ID;

var cleverBots = {};
var responded = {};

/**
 * List of id's i'm trying to mack for real ;) 
 */
var exempt = ['53462e3acea4566666954a91'];

alexbot.mainLoop = function(){
  
  alexbot.client.getUpdates(function(err, data){
    
    _.each(data.matches, function(match){
      _.each(match.messages, function(message){
        
        if (message.to === alexbot.client.userId &&
            new Date(message.sent_date).getTime() > start.getTime() &&
            !responded[message._id] &&
            exempt.indexOf(message.match_id) == -1) {
 
          if (!cleverBots[message.match_id]) {
            cleverBots[message.match_id] = new CleverBot();
          }
    
          console.log("new message from " + message.match_id + ": " + message.message);
    
          cleverBots[message.match_id].write(message.message, function(res){
            
            console.log("responding with", res.message);
            
            alexbot.client.sendMessage(message.match_id, res.message, function(err, data){
              if (!err) {
                responded[message._id] = true;
              }
            });
            
          });
        }
      });
    });
  });
};

alexbot.live();
