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

    this.getAllIssuesArea = function (bbox, callback) {
        $http({
          method: 'POST',
          url: apiUrl + '/issues/search',
          headers: {
            'x-sort': 'updatedOn'
          },
          data:{
            "$and": [ {
              "lat": {
                "$gte": bbox._southWest.lat,
                "$lte": bbox._northEast.lat
              }
              }, {
                "lng": {
                  "$gte": bbox._southWest.lng,
                  "$lte": bbox._northEast.lng
                }
              }
            ]
          }
      }).success(callback)
    }
}])

;
