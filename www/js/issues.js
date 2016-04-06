angular.module('citizen-engagement')


.service('IssueService', ['$http', 'apiUrl', function($http, apiUrl, $ionicLoading) {
    this.getAllIssues = function (successCallback, errorCallback, finallyCallback ) {
        $http({
          method: 'GET',
          url: apiUrl + '/issues',
          headers: {
            "x-sort": "-createdOn",
          }
      }).success(successCallback)
      .error(errorCallback)
      .finally(finallyCallback);
    }
}])

// Get all issues
.controller('ListIssuesCtrl', function(apiUrl, IssueService, $scope, $http, $ionicLoading) {

  $scope.getIssues = function() {
    IssueService.getAllIssues(
        function(data) { // finallyCallback
            $scope.issues = data;
        }, function(err) { // Error callback
            return err;
        }, function() { // finallyCallback
            $scope.$broadcast('scroll.refreshComplete');
            $ionicLoading.hide();
        }
    );
    $ionicLoading.show({
        template: 'Loading issues',
        animation: 'fade-in',
        noBackdrop: true
    });
  }
  $scope.getIssues();

})

// Get specific issue
.controller('GetSpecificIssueCtrl', function(apiUrl, $scope, $state, $http, $ionicLoading, $stateParams) {
    $ionicLoading.show({
        template: 'Loading Issue',
        animation: 'fade-in',
        noBackdrop: true,
        delay: 200
    });
    $http({
      method: 'GET',
      url: apiUrl + '/issues/' + $stateParams.issueId
    }).success(function(issue) {
      $scope.issue = issue;
    }).error(function(error) {
      console.log("error");
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
      $ionicLoading.hide();
    });

  })
  // Add new issue
  .controller('AddIssueCtrl', function(apiUrl, $scope, $http, $state, $ionicLoading, $ionicHistory) {

    $scope.issue = {};

    // Get types
    $ionicLoading.show({
        template: 'Loading Types',
        animation: 'fade-in',
        noBackdrop: true,
        delay: 200
    });
    $http({
      method: 'GET',
      url: apiUrl + '/issueTypes'
    }).success(function(data) {
      $scope.issueTypes = data;
    }).error(function(error) {
      console.log('Could not get types');
    }).finally(function() {
      $ionicLoading.hide();
    });

    $scope.sendIssue = function() {
      $ionicHistory.nextViewOptions({
        disableBack: true // Disable back button on next view
      });
      $ionicLoading.show({
          template: 'Saving Issue',
          animation: 'fade-in',
          noBackdrop: true,
          delay: 200
      });
      $http({
        method: 'POST',
        url: apiUrl + '/issues',
        data: $scope.issue
      }).success(function(data) {
          $ionicLoading.hide();
        $state.go('mainMenu.issueDetails', {
          issueId: data.id
        });
      }).error(function(error) {
        console.log("error...");
      });
    }
  })

.controller('ListMyIssuesCtrl', function(apiUrl, $scope, $http, $ionicLoading) {
  $scope.getIssues = function() {
      $ionicLoading.show({
          template: 'Loading your issues',
          animation: 'fade-in',
          noBackdrop: true,
          delay: 200
      });
    $http({
      method: 'GET',
      url: apiUrl + '/me/issues'
    }).success(function(issues) {
        $ionicLoading.hide();
      $scope.issues = issues;
    }).error(function(error) {
        $ionicLoading.hide();
      console.log(error);
    }).finally(function() {
      // Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
    });
  }
  $scope.getIssues();
})

;
