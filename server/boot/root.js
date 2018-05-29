'use strict';

module.exports = function(server) {
  (function(){
    Date.prototype.yyyymmddhhmm = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
      var hh = this.getHours();
      var mmm = this.getMinutes();
    
      return [this.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd,
              (hh>9 ? '' : '0') + hh,
              (mmm>9 ? '' : '0') + mmm,
             ].join('');
    };
  })()
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
