angular.module('citizen-engagement.newIssue',['ngTagsInput'])

// CameraService offer the user to take a picture with his camera
.factory("CameraService", function($q) {
  return {
    getPicture: function(options) {
      var deferred = $q.defer();
      navigator.camera.getPicture(function(result) {
        deferred.resolve(result);
      }, function(err) {
        deferred.reject(err);
      }, options);
      return deferred.promise;
    }
  }
})

// Main controller for the creation of a new issue.
.controller("newIssueCTRL", function($scope, $http, apiUrl, qimgUrl,qimgToken, geolocation, CameraService, $ionicPopup, $timeout, $state) {

  //Reset the prepared issue to POST and the tags
  $scope.myIssueToPost = {};
  $scope.tags = [];

  // Reset the value for the image validation (by default true = placeholder)
  $scope.imgok = true;

  // Reset the value for the geolocation validation (by default false = no data)
  $scope.geolok = false;

  // GET and the listing of issue types for the form
  $http({
    method: 'GET',
    url: apiUrl + '/issueTypes'
  }).success(function(data) {
    $scope.issueTypes = data;
  })

  //*******  WEB APP CODE GEOLOC *******************************************//
  // Getting the location for the web app users
  geolocation.getLocation().then(function(data) {

    // adding latitude and longitude to the object to post
    $scope.myIssueToPost.lng = data.coords.longitude;
    $scope.myIssueToPost.lat = data.coords.latitude;

    // geolocation status Ok
    $scope.geolok = true;

  }, function(error) {
    // geolocation status not Ok
    $scope.locationProblem = 'Geolocation problem found ('+error+')';
    $scope.geolok = false;
  });
  //***** END **********************************************************//

  //*******  NATIVE APP CODE GEOLOC*******************************************//
  var onSuccess = function(position) {

    // adding latitude and longitude to the object to post
    $scope.myIssueToPost.lng = position.coords.longitude ;
    $scope.myIssueToPost.lat = position.coords.latitude;

    // geolocation status Ok
    $scope.geolok = true;

  };

  function onError(error) {
    // geolocation status not Ok
    $scope.locationProblem = 'Geolocation problem found ('+error+')';
    $scope.geolok = false;
  }

  // Getting the location for the native android user app
  navigator.geolocation.getCurrentPosition(onSuccess, onError);

  //******* END ****************************************************************//

  // Set the url of the picture to null by default
  $scope.myIssueToPost.imageUrl = null;

  // Event when the user click on the submit button, saving the issue to create
  $scope.createAnIssue = function(){
    $http({
      method: 'POST',
      url: apiUrl + '/issues',
      data: $scope.myIssueToPost

    }).success(function(data) {

        // Getting the id of the created issue
        var id = data.id;

        // Build url to post action (tags)
        var url = apiUrl+"/issues/"+id+"/actions";

        // Adapting the format of the tags table to POST it
        var tagsTable = [];
        for(var i=0;i<$scope.tags.length;i++){
          tagsTable.push($scope.tags[i].text);
        }

        // Object Action to POST with the tags table added
        var tagObj = {
          type : "addTags",
          payload :{
            tags : tagsTable
          }
        }
        // Reset the tags table
        tagsTable = [];

        $http({
          method: 'POST',
          url: url,
          data: tagObj
        }).success(function(data, $route) {

            // Alert the user that the issue has been created successfully
            var alertPopup = $ionicPopup.alert({
              title: 'Success!',
              template: 'Your issue has been added'
            });
            // Close it after 3sec.
            $timeout(function() {
             alertPopup.close(); //close the popup after 3 seconds for some reason
           }, 3000);

          // Reset the Issue object to POST
          $scope.myIssueToPost= {};

          // Reset the tags inputs
          $scope.tags = [];

          // Reload the issue creation page
          $state.go($state.$current, null, { reload: true });

        });
    });
  };

  // Event when the user click on the Upload picture button, addi a picture to the issue to create
  $scope.uploadPicture = function(){

    // Disabled the save button during the picture adding process
    $scope.imgok = false;

    // Call to the CameraService to shoot a picture
    CameraService.getPicture({
      // Quality of the picture
      quality: 75,
      // Width of the picture
      targetWidth: 400,
      // Height of the picture
      targetHeight: 300,
      destinationType: Camera.DestinationType.DATA_URL
    }).then(function(imageData) {
        // Post the picture the store it and get the access URL
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

          // Adding the URL of the picture to the issue to create
          $scope.myIssueToPost.imageUrl = data.url;
          // Image validation status update
          $scope.imgok = true;

        }).error(function(){

          // Image validation status update (placeholder)
          $scope.imgok = true;

        });
    });
  }

});
