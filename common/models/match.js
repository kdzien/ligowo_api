const setError = require('./errors');

'use strict';

module.exports = function(Match) {
  Match.updateRank = function(gid,cb) {
    Match.find({"where":{"group_id": {"like":`${gid.toString()}`},"score":{"nlike":'3'},"date":{lt:new Date().yyyymmddhhmm()}}},(err,matches)=>{
      if(err){
        throw new Error(err)
      }else{
        let n = 0;
        (function async(){
          if(n<=matches.length-1){
            Match.app.models.Bet.find({"where":{"matchId":`${matches[n].id}`,"status":{"neq":'1'}}},(err,bets)=>{
              let j = 0;
              (function async2(){
                if(j<=bets.length-1){
                  let win,status;
                  bets[j].type==matches[n].score ? win=true : win=false;
                  win==true ? status=1 : status=2;
                  bets[j].updateAttributes({status:status},(err,betinst)=>{
                    if(win==true){
                      Match.app.models.Rank.findOrCreate({"where":{"group_id": {"like":`${gid.toString()}`},"user_id": {"like":`${bets[j].user_id}`}}},{group_id:gid,user_id:bets[j].user_id,rank:0},(err,stat)=>{
                        let newRank = stat.rank +1;
                        stat.updateAttributes({rank:newRank},(err,rankinst)=>{
                          j++;async2();
                        })
                      })
                    }else{
                      j++;async2();
                    }
                  })
                }else{
                  n++;async();
                }
              })()
            })
          } else{
            cb(null,"Zaaktualizowano ranking");
          }
        })()
      }
    });
  };

  Match.matches = function(uid,gid,cb) {
      Match.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,matches)=>{
          let matchesIds = [];
          matches.forEach(elem=>{
              matchesIds.push(elem.id)
          })
          Match.app.models.Bet.find({"where":{"user_id": {"like":`${uid}`}}},(err,bets)=>{
            let betsTemp = [];
            bets.forEach(elem=>{
              if(matchesIds.indexOf(elem.matchId.toString())>-1){
                betsTemp.push(elem);
              }
            })

              let noMatch = [];
              betsTemp.forEach(elem=>{
                  noMatch.push(elem.matchId)
              })
              Match.find({"where":{"group_id": {"like":`${gid.toString()}`}, "id":{"nin": noMatch},"date":{gt:new Date().yyyymmddhhmm()}}},(err,matchesr)=>{
                  cb(null,matchesr)
              })
          })
      })
  };

  Match.userMatchesLeft = function(uid,gid,cb) {
      Match.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,matches)=>{
          let matchesIds = [];
          matches.forEach(elem=>{
              matchesIds.push(elem.id.toString())
          })
          Match.app.models.Bet.find({"where":{"date":{gt:new Date().yyyymmddhhmm()},"user_id": {"like":`${uid}`}}},(err,bets)=>{
            let betsTemp = [];
            bets.forEach(elem=>{
              if(matchesIds.indexOf(elem.matchId.toString())>-1){
                betsTemp.push(elem);
              }
            })
                let n = 0;
                (function async(){
                  if(n<=betsTemp.length-1){
                    Match.findOne({
                      where:{"id": `${betsTemp[n].matchId}`}
                    },(err,match)=>{
                      betsTemp[n].match = match;
                      n++;
                      async();
                    })
                  }else{
                    cb(null,betsTemp)
                  }
                })()
          })
      })
  };
  Match.allGroupMatches = function(gid,cb) {
    Match.find({"where":{"group_id": {"like":`${gid.toString()}`},"score": 3,"date":{lt:new Date().yyyymmddhhmm()}}},(err,matches)=>{
      if(err){
        throw new Error(err)
      }else{
        cb(null,matches)
      }
    });
  };

  Match.userMatchesDone = function(uid,gid,cb) {
      Match.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,matches)=>{
          let matchesIds = [];
          matches.forEach(elem=>{
              matchesIds.push(elem.id.toString())
          })
          Match.app.models.Bet.find({"where":{"date":{lt:new Date().yyyymmddhhmm()},"user_id": {"like":`${uid}`}},include: 'matches'},(err,bets)=>{
            let betsTemp = [];
            bets.forEach(elem=>{
              if(matchesIds.indexOf(elem.matchId.toString())>-1){
                betsTemp.push(elem);
              }
            })
            let n = 0;
            (function async(){
              if(n<=betsTemp.length-1){
                Match.findOne({
                  where:{"id": `${betsTemp[n].matchId}`}
                },(err,match)=>{
                  betsTemp[n].match = match;
                  n++;
                  async();
                })
              }else{
                cb(null,betsTemp)
              }
            })()
          })
      })
  };
  Match.remoteMethod(
    'allGroupMatches', {
        http: {
        path: '/bets/groupMatches/:gid',
        verb: 'get'
        },
        'accepts': [{ arg: 'gid', type: 'string' }],
        returns: {
          type: ['match'],
          root:true
        }
    }
  );
  Match.remoteMethod(
    'updateRank', {
        http: {
        path: '/updateRank/:gid',
        verb: 'get'
        },
        'accepts': [{ arg: 'gid', type: 'string' }],
        returns: {
          type: 'string',
          root:true
        }
    }
  );

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
