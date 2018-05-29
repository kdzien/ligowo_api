const setError = require('./errors.js');
'use strict';

module.exports = function(Bet) {

  Bet.updateBet = function(bid,type,cb) {
    Bet.findOne({
      where:{"id": `${bid}`}
    },(err,bet)=>{
      if(err){
        return cb(setError(err))
      }else{
        console.log(bet)
        if(bet.date< new Date().yyyymmddhhmm()){
          return cb(setError("Za pozno :("))
        }else{
          bet.updateAttributes({type:type},(err,betinst)=>{
            cb(null,betinst)
          })
        }
      }
    })
};
Bet.remoteMethod(
  'updateBet', {
      http: {
      path: '/updateBet/:bid/:type',
      verb: 'patch'
      },
      'accepts': [{ arg: 'bid', type: 'string' },{ arg: 'type', type: 'string' }],
      returns: {
        type: "string",
        root:true
      }
  }
);
};
