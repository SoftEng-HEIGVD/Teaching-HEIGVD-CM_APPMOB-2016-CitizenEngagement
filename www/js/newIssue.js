angular.module('citizen-engagement.newIssue',['ngTagsInput'])


.controller("newIssueCTRL", function($scope, $http, apiUrl) {
  console.log(apiUrl)

  //$scope.$on('$ionicView.beforeEnter', function() {

    $http({
      method: 'GET',
      url: apiUrl + '/issueTypes'
      //data: $scope.issueTypes

    }).success(function(data) {
      console.log(data)
      $scope.issueTypes = data;

    })







      $scope.createAnIssue = function(){

        console.log($scope.myIssueToPost)
        /*var myIssueToPost = {}
        myIssueToPost.description = $scope.description;

        console.log(myIssueToPost.description)*/




        /*$http({
          method: 'POST',
          url: apiUrl + '/issue'
          //data: $scope.issueTypes

        }).success(function(data) {
          console.log(data)
          $scope.issueTypes = data;

        })*/

    }


  //})





});
