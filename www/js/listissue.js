angular.module('FixYourStreet.listIssue', [])

.controller('ListIssuesAreaCtrl', function (apiUrl, AuthService, $http, $ionicLoading, $scope) {

    // The $ionicView.beforeEnter event happens every time the screen is displayed.
    $scope.$on('$ionicView.beforeEnter', function() {
      // Re-initialize the user object every time the screen is displayed.
      // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
      $scope.issues = {};
    });

    $scope.getAreaIssues = function() {

      // Forget the previous error (if any).
      delete $scope.error;

      // Make the request to retrieve issues
      $http({
        method: 'GET',
        url: apiUrl + '/issues',
        data: $scope.issues
      }).success(function(issues) {
        $scope.issues = issues;
      }).error(function() {
        $scope.error = 'Could not retrieve Issues.';
      });
    };

    $scope.getAreaIssues();
})

;
