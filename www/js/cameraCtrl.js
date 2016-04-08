angular.module('citizen-engagement.cameraCtrl',[])

.factory("CameraService", function($q) {
  return {
  getPicture: function(options) {
    var deferred = $q.defer();
    navigator.camera.getPicture(function(result) {
      // do any magic you need
      deferred.resolve(result);
      }, function(err) {
      deferred.reject(err);
      }, options);
        return deferred.promise;
    }
  }
})

;
