angular.module('citizen-engagement.newIssue',['ngTagsInput'])

.controller("newIssueCTRL", function($scope, $http, apiUrl, $cordovaImagePicker,geolocation) {

  $scope.myIssueToPost = {};

  $http({
    method: 'GET',
    url: apiUrl + '/issueTypes'
  }).success(function(data) {
    console.log(data)
    $scope.issueTypes = data;
  })

  geolocation.getLocation().then(function(data) {

     $scope.myIssueToPost.lng = data.coords.longitude;
     $scope.myIssueToPost.lat = data.coords.latitude;
     $scope.geolok = true;

    }, function(error) {
      $scope.locationProblem = 'Geolocation problem found ('+error+')';
      $scope.geolok = false;
    });

  $scope.myIssueToPost.imageUrl = 'http://lorempicsum.com/futurama/350/200/1';


  // Event when the user click on the submit button
  $scope.createAnIssue = function(){    
    $http({
      method: 'POST',
      url: apiUrl + '/issues',
      data: $scope.myIssueToPost

    }).success(function(data) {
        var id = data.id;
        var url = apiUrl+"/issues/"+id+"/actions";

        var tags = [];
        for(var i=0;i<$scope.tags.length;i++){
          tags.push($scope.tags[i].text);
        }
        
        var tagObj = {
          type : "addTags",
          payload :{
            tags : tags
          }
        }

        $http({
          method: 'POST',
          url: url,
          data: tagObj
        }).success(function(data) {
            console.log("tags added");
        });
    });
  };
});
