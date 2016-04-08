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
});


.controller("cameraController", function(CameraService, $http, qimgUrl, qimgToken) {
  // take the picture
  CameraService.getPicture({
    quality: 75,
    targetWidth: 500,
    targetHeight: 500,
    // return base64-encoded data instead of a fileg
    destinationType: Camera.DestinationType.DATA_URL
    }).then(function(imageData) {
      // upload the image
      $http({
      method: "POST",
      url: qimgUrl + "/images",
      headers: {
      Authorization: "Bearer " + qimgToken
      },
      data: {
      data: imageData
    }
    }).success(function(data) {
      var imageUrl = data.url;
      // do something with imageUrl
    });
  });
})

;

