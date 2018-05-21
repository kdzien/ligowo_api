'use strict';

module.exports = function(server) {
  (function(){
    Date.prototype.yyyymmddhhmm = function() {
      var mm = this.getMonth() + 1; // getMonth() is zero-based
      var dd = this.getDate();
    
      return [this.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd, this.getHours(),this.getMinutes()
             ].join('');
    };
  })()
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
