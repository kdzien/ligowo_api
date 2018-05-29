'use strict';

module.exports = function(Groups) {
  Groups.join = function(email,gid,cb) {
    console.log(email)
    Groups.findOne({
      where:{"id": `${gid}`}
    },(err,group)=>{
      if(err){cb(err)}
      else{
        if(!group){
          cb(null,"Nie ma takiej grupy, spróbuj ponownie")
        }else{
          let oldUsers = group.users;
          Groups.app.models.User.findOne({where:{"email":email}},(err,user) => {
            console.log(user)
            if(!user){
              cb(null,"Nie ma takiego użytkownika")
            }
            else if(oldUsers.indexOf(user.id)!==-1){
              cb(null,"Użytkownik należy już do tej grupy")
            }
            else{
              let newUsers = group.users;
              newUsers.push(user.id);
              group.updateAttributes({users:newUsers},(err,instance)=>{
              if(err){cb(err)}
              else{
                cb(null, "Zostałeś dodany do grupy!");
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
      if(err){cb(null,err)}
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
