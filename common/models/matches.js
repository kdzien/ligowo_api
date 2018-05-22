'use strict';

module.exports = function(Matches) {
    Matches.getFinished = function(uid,gid,cb) {
    let current_date = new Date();
    Matches.find(
        {"where" : {"group_id" : { "like" : gid}}}
      ,(err,matches)=>{
      if(err){
        cb(null,{error:err})
      }else{
        let returnArray = [];
        function containsObject(user, bets) {
          var i;
          for (i = 0; i < bets.length; i++) {
              if (bets[i].user_id === user) {
                  return true;
              }
          }
          return false;
      }
        matches.forEach((match,i)=>{
          console.log(match)
          if(!containsObject(uid,match.bets)){
            returnArray.push(match)
          }
          if(i==matches.length-1){
            cb(null,returnArray)
          }
        })
      }

    })

  };
  Matches.remoteMethod(
    'getFinished', {
      http: {
        path: '/finished/:uid/:gid',
        verb: 'get'
      },
      'accepts': [{ arg: 'uid', type: 'string' },{ arg: 'gid', type: 'string' }],
      returns: {
        arg: 'data',
        type: 'object'
      }
    },
  );
};
