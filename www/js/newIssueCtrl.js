angular.module('citizen-engagement.newIssueCtrl',['geolocation'])

    .controller('newIssueCtrl',
        function ($scope, $http,apiUrl,geolocation, CameraService, qimgUrl, qimgToken) {

          $scope.issue = {};

            $scope.loadUsers = function() {
                $http.get(apiUrl+'/users').success(function(users) {
                    $scope.users = users;
                });
            };

            $scope.loadIssueType = function () {
                $http.get(apiUrl + '/issueTypes').success(function (issueTypes) {
                    $scope.issueTypes = issueTypes;
                    //console.log(issueTypes[0].name);
                    index = 0;
                    while (index < issueTypes.length)
                    {
                        console.log(issueTypes[index].name);
                        index++;
                    }
                });
            };

            $scope.takePicture = function (){
              CameraService.getPicture({
                quality: 75,
                targetWidth: 400,
                targetHeight: 300,
                // return base64-encoded data instead of a file
                destinationType: Camera.DestinationType.DATA_URL
              }).then(function(imageData) {
                $http({
                  method: "POST",
                  url: qimgUrl + "/images",
                  headers: {
                    Authorization: "Bearer " + qimgToken
                  },
                  data: {
                    data: imageData
                      //type: 'comment',
                      //payload: {
                      //    text: 'bla bla'
                      //}
                  }
                }).success(function(data) {
                  var imageUrl = data.url;
                  console.log(imageUrl);
                  $scope.issue.imageUrl = imageUrl;
                // do something with imageUrl
                });
              });
            }

            $scope.submitIssue= function(issue){
              console.log('submit issue');
                geolocation.getLocation().then(function(data){
                    issue.lat=data.coords.latitude;
                    issue.lng=data.coords.longitude;
                    console.log(JSON.stringify(issue));

                    $http({
                        method: 'POST',
                        url: apiUrl+'/issues',
                        data: issue

                    });
                }, function() {
                  console.log('Could not get geolocation');
                });


                /* $scope.lng.myIssueLng;
                $scope.lat.myIssueLat;
                $scope.imageUrl.myIssueUrl;
                $scope.issueTypeId.myIssueTypeId,*/
                    /*$scope.pushNewIssue=function(){
                        $http.post(apiUrl+'/issues/').success(function(issueCurrent){

                        })
                    }*/
            }
            $scope.loadIssueType();
        })

  .controller('PagesCtrl', function ($scope, $stateParams,$http,apiUrl) {
    var currentId = $stateParams.issueId;
    $scope.loadCurrentIssue=function(){
        $http.get(apiUrl+'/issues/'+currentId).success(function(issueCurrent){
            $scope.issueCurrent=issueCurrent;
            console.log(issueCurrent);
        })
    }

    $scope.loadCurrentIssue();
  })

.controller("cameraController", function(CameraService, $http, qimgUrl, qimgToken) {
  // take the picture
  CameraService.getPicture({
    quality: 75,
    targetWidth: 400,
    targetHeight: 300,
    // return base64-encoded data instead of a file
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
