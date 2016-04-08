angular.module('FixYourStreet.comments', [])

  //controller pour cr�er un nouveau commment
  .controller("newComment", function ($scope, $log, $stateParams, $state, $http, apiUrl) {
      $scope.inputs = [{
              value: null
          }];

      $scope.goToNewComment = function (issue) {
          $state.go("newComment", {issueId: issue.id});
      };

      $scope.createComment = function () {
          var comment = {
              type: "comment",
              payload: {
                  text: $scope.someText
              }
          }
          $http({
              method: 'POST',
              url: apiUrl + '/issues/' + $stateParams.issueId + '/actions',
              data: comment,
              headers: {
                  'x-sort': 'updatedOn'
              }
          }).success(function (createdComment) {
              console.log(createdComment);
          }).error(function error() {
              $log.error("Could not create Comments: " + error);
          });
      }
  })

  //controller pour afficher la liste des commentaires
  .controller('commentsList', function ($scope, $log, $stateParams, $http, apiUrl) {
      // The $ionicView.beforeEnter event happens every time the screen is displayed.
      $scope.$on('$ionicView.beforeEnter', function () {
          // Re-initialize the user object every time the screen is displayed.
          // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
          $scope.issues = {};
      });
      $http({
          method: 'GET',
          url: apiUrl + '/issues/' + $stateParams.issueId,
      }).success(function (issue) {
          $scope.issue = issue;
      }).error(function () {
          $log.error("Could not retrieve Issues: " + error);
      });
  })

;
