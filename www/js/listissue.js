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
      $scope.data = {
        "loc": {
          "$geoWithin": {
            "$centerSphere" : [
              [ 6.622009 , 46.766129 ],
              0.1
            ]
          }
        }
      };

      // Make the request to retrieve issues
      $http({
        method: 'POST',
        url: apiUrl + '/issues/search',
        data: $scope.data,
      }).success(function(issues) {
        $scope.issues = issues;
      }).error(function() {
        $scope.error = 'Could not retrieve Issues.';
      });
    };

    $scope.getAreaIssues();
})

.service('IssueService', ['$http', 'apiUrl', function($http, apiUrl) {
      var match = {
        "loc": {
          "$geoWithin": {
            "$centerSphere" : [
              [ 6.622009 , 46.766129 ],
              0.1
            ]
          }
        }
      };

    this.getAllIssuesArea = function (successCallback, errorCallback) {
        $http({
          method: 'POST',
          url: apiUrl + '/issues/search',
          headers: {
            'x-sort': 'updatedOn'
          },
          data: match,
      }).success(successCallback)
      .error(errorCallback)
    }
}])

.service('ReverseGeocoding', ['$http', 'apiUrl','mapboxAccessToken', function($http, apiUrl, mapboxAccessToken) {
    this.getPlaces = function (successCallback, errorCallback) {
        $http({
          method: 'GET',
          url: 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + 'Yverdon' + '.json?access_token=' + mapboxAccessToken
      }).success(successCallback)
      .error(errorCallback)
    }
}])


;
