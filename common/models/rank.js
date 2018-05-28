'use strict';

module.exports = function(Rank) {
  Rank.getGroupRank = function(gid,cb) {
    Rank.find({"where":{"group_id": {"like":`${gid.toString()}`}}},(err,ranks)=>{
      if(err){throw new Error()}else{
        let n = 0;
        (function async(){
          if(n<=ranks.length-1){
            Rank.app.models.User.findOne({
              where:{"id": `${ranks[n].user_id}`}
            },(err,usr)=>{
              ranks[n].user = usr;
              n++;
              async();
            })
          }else{
            cb(null,ranks)
          }
        })()
      }
    })
};
Rank.remoteMethod(
  'getGroupRank', {
      http: {
      path: '/:gid',
      verb: 'get'
      },
      'accepts': [{ arg: 'gid', type: 'string' }],
      returns: {
        type: ['rank'],
        root:true
      }
  }
);
};
