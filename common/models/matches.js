'use strict';

module.exports = function(Matches) {
    Matches.getFinished = function(uid,gid,cb) {
    let current_date = new Date();
    console.log(gid)
    Matches.find(
        {"where" : {"group_id" : { "like" : "5b02b39167d9042a5025bb20"}}}
      ,(err,matches)=>{
      if(err){
        console.log(err)
        cb(null,{error:err})
      }else{
        let returnArray = [];
        console.log(matches)
        matches.forEach((match,i)=>{
            console.log(i)
            match.bets.forEach((elem,j)=>{
                console.log(j)
                if(elem.user_id==uid){
                    returnArray.push(match)
                    if(i==matches.length-1 && j==elem.length-1){
                        console.log("cb")
                        cb(null,returnArray)
                    };
                }
            })
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