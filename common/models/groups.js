let setError = require('./errors.js')
'use strict';

module.exports = function(Groups) {
  Groups.join = function(email,gid,cb) {
    console.log(email)
    Groups.findOne({
      where:{"id": `${gid}`}
    },(err,group)=>{
      if(err){
        return cb(setError(err,400))
      }
      else{
        if(!group){
          return cb(setError("Nie ma takiej grupy",400))
        }else{
          let oldUsers = group.users;
          Groups.app.models.User.findOne({where:{"email":email}},(err,user) => {
            if(!user){
              return cb(setError("Nie ma takiego użytkownika",400))
            }
            else if(oldUsers.indexOf(user.id.toString())!==-1){
              return cb(setError("Użytkownik już należy do tej grupy",400))
            }
            else{
              let newUsers = group.users;
              newUsers.push(user.id);
              group.updateAttributes({users:newUsers},(err,instance)=>{
              if(err){return cb(setError(err,400))}
              else{
                cb(null, instance);
              }
              })
            }
          })
        }
      }
    })
  };
  Groups.usergroups = function(uid,cb) {
    Groups.find({
      where:{"users": {"like" : `${uid.toString()}`} }
    },(err,groups)=>{
      if(err){return cb(setError(err,400))}
      else{
        cb(null, groups);
      }
    })
  };
  Groups.remoteMethod(
    'join', {
      http: {
        path: '/join/:gid/:uid',
        verb: 'patch'
      },
      'accepts': [{ arg: 'uid', type: 'string' },{ arg: 'gid', type: 'string' }],
      returns: {
        arg: 'status',
        type: 'object'
      }
    }
  );
  Groups.remoteMethod(
    'usergroups', {
      http: {
        path: '/usergroups/:uid',
        verb: 'get'
      },
      'accepts': [{ arg: 'uid', type: 'string' }],
      returns: {
        arg: 'data',
        type: 'array'
      }
    }
  );
};
