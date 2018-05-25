'use strict';

module.exports = function(Match) {

  Match.matches = function(uid,gid,cb) {
    console.log(gid)
      Match.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,matches)=>{
          let matchesIds = [];
          matches.forEach(elem=>{
              matchesIds.push(elem.id)
          })
          Match.app.models.Bet.find({"where":{"user_id": {"like":`${uid}`},'matchId':{"inq" : matchesIds}}},(err,bets)=>{
              let noMatch = [];
              bets.forEach(elem=>{
                  noMatch.push(elem.matchId)
              })
              console.log(noMatch)
              Match.find({"where":{"group_id": {"like":`${gid.toString()}`}, "id":{"nin": noMatch}}},(err,matchesr)=>{
                console.log(matchesr)
                  cb(null,matchesr)
              })
          })
      })
  };

  Match.userMatchesLeft = function(uid,gid,cb) {
      Match.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,matches)=>{
          let matchesIds = [];
          matches.forEach(elem=>{
              matchesIds.push(elem.id)
          })
          Match.app.models.Bet.find({"where":{"date":{gt:new Date().yyyymmddhhmm()},"user_id": {"like":`${uid}`},'matchId':{"inq" : matchesIds}}},(err,bets)=>{
                let n = 0;
                (function async(){
                  if(n<=bets.length-1){
                    Match.findOne({
                      where:{"id": `${bets[n].matchId}`}
                    },(err,match)=>{
                      bets[n].match = match;
                      n++;
                      async();
                    })
                  }else{
                    cb(null,bets)
                  }
                })()
          })
      })
  };

  Match.userMatchesDone = function(uid,gid,cb) {
      Match.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,matches)=>{
          let matchesIds = [];
          matches.forEach(elem=>{
              matchesIds.push(elem.id)
          })
          Match.app.models.Bet.find({"where":{"date":{lt:new Date().yyyymmddhhmm()},"user_id": {"like":`${uid}`},'matchId':{"inq" : matchesIds}},include: 'matches'},(err,bets)=>{
            let n = 0;
            (function async(){
              if(n<=bets.length-1){
                Match.findOne({
                  where:{"id": `${bets[n].matchId}`}
                },(err,match)=>{
                  bets[n].match = match;
                  n++;
                  async();
                })
              }else{
                cb(null,bets)
              }
            })()
          })
      })
  };

  Match.remoteMethod(
    'userMatchesLeft', {
        http: {
        path: '/bets/userleft/:uid/:gid',
        verb: 'get'
        },
        'accepts': [{ arg: 'uid', type: 'string' },{ arg: 'gid', type: 'string' }],
        returns: {
          type: ['match'],
          root:true
        }
    }
  );
  Match.remoteMethod(
      'matches', {
        http: {
        path: '/bets/:uid/:gid',
        verb: 'get'
        },
        'accepts': [{ arg: 'uid', type: 'string' },{ arg: 'gid', type: 'string' }],
        returns: {
        arg: 'data',
        type: ['match'],
        root:true
        }
    }
  )
  Match.remoteMethod(
'userMatchesDone', {
  http: {
  path: '/bets/userdone/:uid/:gid',
  verb: 'get'
  },
  'accepts': [{ arg: 'uid', type: 'string' },{ arg: 'gid', type: 'string' }],
  returns: {
    type: ['match'],
    root:true
  }
}
  )
};
