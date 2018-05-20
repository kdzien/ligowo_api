'use strict';

module.exports = function(Bets) {
  Bets.getFinished = function(filter,cb) {
    console.log(filter)
    Bets.find({
      where: {group_id: filter.group_id,
              user_id: filter.user_id
      }
    },(err,returns)=>{
      if(err){
        cb(null,{error:err})
      }
      cb(null, returns);
    })

  };
  Bets.remoteMethod(
    'getFinished', {
      http: {
        path: '/finished',
        verb: 'get'
      },
      'accepts': [{'arg': 'filter','type': 'object'}],
      returns: {
        arg: 'data',
        type: 'object'
      }
    },
  );
};
