'use strict';

module.exports = function(Match) {

Match.matches = function(uid,gid,cb) {
    Match.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,matches)=>{
        let matchesIds = [];
        matches.forEach(elem=>{
            matchesIds.push({"matchId":elem.id})
        })
        Match.app.models.Bet.find({"where":{"user_id": `${uid}`,"or": matchesIds}},(err,bets)=>{
            let noMatch = [];
            bets.forEach(elem=>{
                noMatch.push(elem.matchId)
            })
            Match.find({"where":{"id":{"nin": noMatch}}},(err,matchesr)=>{
                cb(null,matchesr)
            })
        })
    })
};
//TODO dopisac warunek daty
Match.userMatchesLeft = function(uid,gid,cb) {
    Match.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,matches)=>{
        let matchesIds = [];
        matches.forEach(elem=>{
            matchesIds.push({"matchId":elem.id})
        })
        Match.app.models.Bet.find({"where":{"user_id": `${uid}`,"or": matchesIds}},(err,bets)=>{
            cb(null,bets)
        })
    })
};
//TODO dopisac warunek daty
Match.userMatchesDone = function(uid,gid,cb) {
    Match.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,matches)=>{
        let matchesIds = [];
        matches.forEach(elem=>{
            matchesIds.push({"matchId":elem.id})
        })
        Match.app.models.Bet.find({"where":{"user_id": `${uid}`,"or": matchesIds}},(err,bets)=>{
            cb(null,bets)
        })
    })
};

Match.remoteMethod(
    'matches', {
        http: {
        path: '/bets/:uid/:gid',
        verb: 'get'
        },
        'accepts': [{ arg: 'uid', type: 'string' },{ arg: 'gid', type: 'string' }],
        returns: {
        arg: 'data',
        type: 'array'
        }
    },
    'userMatchesLeft', {
        http: {
        path: '/bets/userleft/:uid/:gid',
        verb: 'get'
        },
        'accepts': [{ arg: 'uid', type: 'string' },{ arg: 'gid', type: 'string' }],
        returns: {
        arg: 'data',
        type: 'array'
        }
    },
    'userMatchesDone', {
        http: {
        path: '/bets/userdone/:uid/:gid',
        verb: 'get'
        },
        'accepts': [{ arg: 'uid', type: 'string' },{ arg: 'gid', type: 'string' }],
        returns: {
        arg: 'data',
        type: 'array'
        }
    }
);
};
