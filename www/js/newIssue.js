angular.module('citizen-engagement.newIssue',['ngTagsInput','geolocation'])

.controller("newIssueCTRL", function($scope, $http, apiUrl, geolocation) {

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

    console.log($scope.myIssueToPost)
    console.log($scope.tagz)

    $http({
      method: 'POST',
      url: apiUrl + '/issues',
      data: $scope.myIssueToPost

    }).success(function(data) {
      console.log('teuf')
      console.log(data)


    })

  }

});
