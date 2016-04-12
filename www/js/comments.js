angular.module('FixYourStreet.comments', [])

  //Create new comment
  .controller("newComment", function ($scope, $log, $stateParams, $state, $http, apiUrl, $ionicLoading) {
      $scope.inputs = [{
              value: null
          }];

      $scope.createComment = function () {
          var comment = {
              type: "comment",
              payload: {
                  text: $scope.someText
              }
          }
          $ionicLoading.show({
              template: 'Creating...',
              delay: 750
          });
          $http({
              method: 'POST',
              url: apiUrl + '/issues/' + $stateParams.issueId + '/actions',
              data: comment
          }).success(function (createdComment) {
              $ionicLoading.hide();
              $state.go("commentsList", { issueId: $stateParams.issueId});
          }).error(function error() {
              $ionicLoading.hide();
              $log.error("Could not create Comments: " + error);
          });
      }
  })

  //List Comments
  .controller('commentsList', function ($scope, $log, $stateParams, $log, IssueService, $http, apiUrl) {
    $scope.$on('$ionicView.beforeEnter', function () {
        IssueService.getById($stateParams.issueId, function(issue) {
              $scope.issue = issue;
       }, function(error) {
         $log.error("Could not retrieve Issues: " + error);
       });

    });

  })

;
